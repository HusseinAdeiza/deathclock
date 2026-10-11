/**
 * Regression test: `withdraw` returns the owner's funds, and only the owner's.
 *
 * Added because the vault had no way out. Deposits were one-way, so an owner who
 * changed their mind had no path to recover -- a product gap rather than a
 * security one, but the kind that stops anyone using it with real money.
 *
 * Five properties are asserted, each a way this could go wrong:
 *   1. The owner can withdraw while Active, and the vault stays rent-exempt.
 *   2. The owner can withdraw from Missed and Challenged too.
 *   3. Withdrawal is rejected once Released -- the funds belong to the heirs, and
 *      letting the owner pull them back would undo a settled release.
 *   4. A non-owner signer is rejected by the seed binding and `has_one`.
 *   5. Withdrawal resets the death clock, so `report_death` cannot fire straight
 *      afterwards. Without the reset an owner could withdraw past a missed window
 *      and re-trigger a release on the next tick.
 *
 * Runs against a local validator: intervals are supplied in seconds so the state
 * machine can be walked forward inside a test.
 */
import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Deathclock } from "../target/types/deathclock";

describe("withdraw", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Deathclock as Program<Deathclock>;
  const connection = provider.connection;
  const heir = Keypair.generate();
  const stranger = Keypair.generate();

  const INTERVAL = new BN(2);
  const CHALLENGE = new BN(2);
  const DEPOSIT = new BN(1 * LAMPORTS_PER_SOL);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function airdrop(keypair: Keypair, sol = 5) {
    // The validator's faucet credits any address, so the per-test owner can be
    // funded from the identity rather than needing a prior balance.
    const signature = await connection.requestAirdrop(keypair.publicKey, sol * LAMPORTS_PER_SOL);
    const latest = await connection.getLatestBlockhash("confirmed");
    await connection.confirmTransaction({ signature, ...latest }, "confirmed");
  }

  /** A fresh vault owned by `owner`, funded with 1 SOL and Active. */
  async function freshVault(owner: Keypair) {
    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), owner.publicKey.toBuffer()],
      program.programId,
    );

    await program.methods
      .initializeVault([heir.publicKey], Buffer.from([100]), INTERVAL, CHALLENGE)
      .accounts({ owner: owner.publicKey })
      .signers([owner])
      .rpc();

    await program.methods
      .deposit(DEPOSIT)
      .accounts({ owner: owner.publicKey, vault })
      .signers([owner])
      .rpc();

    return vault;
  }

  async function withdrawAs(owner: Keypair, vault: PublicKey) {
    return program.methods
      .withdraw()
      .accounts({ owner: owner.publicKey, vault, systemProgram: web3.SystemProgram.programId })
      .signers([owner])
      .rpc();
  }

  /** Walk the vault forward to the requested state. */
  async function advanceTo(vault: PublicKey, state: "missed" | "challenged" | "release") {
    await sleep((INTERVAL.toNumber() + 1) * 1000);
    await program.methods.reportDeath().accounts({ vault }).rpc();
    if (state === "missed") return;

    await program.methods.initiateChallenge().accounts({ vault }).rpc();
    if (state === "challenged") return;

    await sleep((CHALLENGE.toNumber() + 1) * 1000);
    await program.methods.resolveChallenge(false).accounts({ vault }).rpc();
  }

  it("lets the owner withdraw while Active, keeping the vault rent-exempt", async () => {
    const owner = Keypair.generate();
    await airdrop(owner);
    const vault = await freshVault(owner);

    const vaultBefore = await connection.getBalance(vault);
    await withdrawAs(owner, vault);

    const vaultAfter = await connection.getBalance(vault);
    expect(vaultAfter).to.be.lessThan(vaultBefore);

    // The PDA has to stay above the rent floor, or it is collected and the
    // state is lost while the account still exists.
    const reserve = await connection.getMinimumBalanceForRentExemption(8 + 300);
    expect(vaultAfter).to.be.at.least(reserve);

    const state = await program.account.vault.fetch(vault);
    expect(state.state).to.deep.equal({ active: {} });
  });

  it("lets the owner withdraw from Missed and Challenged", async () => {
    for (const target of ["missed", "challenged"] as const) {
      const owner = Keypair.generate();
      await airdrop(owner);
      const vault = await freshVault(owner);
      await advanceTo(vault, target);

      await withdrawAs(owner, vault);

      const after = await program.account.vault.fetch(vault);
      expect(after.state, `withdraw from ${target}`).to.deep.equal({ active: {} });
    }
  });

  it("rejects a withdrawal once the estate is Released", async () => {
    const owner = Keypair.generate();
    await airdrop(owner);
    const vault = await freshVault(owner);
    await advanceTo(vault, "release");

    const [treasury, treasuryBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId,
    );

    const releasable = await program.account.vault.fetch(vault);
    await program.methods
      .releaseInheritance(treasuryBump)
      .accounts({ vault, treasury, systemProgram: web3.SystemProgram.programId })
      .remainingAccounts(
        releasable.heirs.map((pubkey: PublicKey) => ({ pubkey, isSigner: false, isWritable: true })),
      )
      .rpc();

    const terminal = await program.account.vault.fetch(vault);
    expect(terminal.state).to.deep.equal({ released: {} });

    try {
      await withdrawAs(owner, vault);
      expect.fail("withdraw should have been rejected on a Released vault");
    } catch (error) {
      expect(String(error)).to.match(/InvalidState/);
    }
  });

  it("rejects a withdrawal signed by anyone but the owner", async () => {
    const owner = Keypair.generate();
    await airdrop(owner);
    const vault = await freshVault(owner);
    await airdrop(stranger);

    try {
      await withdrawAs(stranger, vault);
      expect.fail("a non-owner should not be able to withdraw");
    } catch (error) {
      expect(String(error)).to.match(/ConstraintSeeds|ConstraintHasOne|Seeds|Error Number: 2006|Error Number: 2015/);
    }
  });

  it("resets the death clock so report_death cannot fire straight after", async () => {
    const owner = Keypair.generate();
    await airdrop(owner);
    const vault = await freshVault(owner);
    await advanceTo(vault, "missed");

    await withdrawAs(owner, vault);

    const after = await program.account.vault.fetch(vault);
    const lastHeartbeat = after.lastHeartbeat.toNumber();
    expect(after.deathReportedAt.toNumber()).to.equal(0);

    // Without the clock reset this would succeed and hand the heirs an estate
    // the owner just withdrew from.
    try {
      await program.methods.reportDeath().accounts({ vault }).rpc();
      expect.fail("report_death should be refused while the heartbeat is fresh");
    } catch (error) {
      expect(String(error)).to.match(/HeartbeatNotExpired/);
    }

    const unchanged = await program.account.vault.fetch(vault);
    expect(unchanged.lastHeartbeat.toNumber()).to.equal(lastHeartbeat);
  });
});
