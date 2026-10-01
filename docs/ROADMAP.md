# Roadmap

Where DeathClock is, what blocks it from being a product someone can safely put
money into, and what would have to be true to raise.

Written after the Crypto World's Fair build. It is deliberately specific about
what is proven and what is not, because an investor or a security reviewer will
check, and because the honest version is more useful than the optimistic one.

---

## Where we actually are

**Proven and verifiable today**

| Claim | Evidence |
|---|---|
| Groth16 verification runs inside the Solana VM | tx `3KuQVp5k…`, 183,194 / 200,000 CU, `err: None` |
| The three programs are live on devnet | `npm run verify:deploy` → slot `505959380` |
| A funded vault decodes through the site's own path | `npm run verify:live-vault` |
| The payout redirection flaw is fixed on-chain | guards in the deployed bytecode |
| The verifier bytecode is reproducible from this repo | vendored under `vendor/risc0-solana/` |

**Known gaps, stated plainly**

- Proving takes 231–461 s against a 300 s freshness window. This is the
  binding constraint on the product.
- The ZK proof delivers attestation, not privacy: the guest commits owner,
  timestamp, and nonce in the clear.
- `resolve_challenge` is permissionless — griefable, not fund-stealing.
- No third-party audit. Devnet only. No mainnet deployment.
- Payouts move lamports, not SPL tokens (see `MIGRATION-NOTES.md`).

---

## Phase 0 — Get proving under the window (blocking everything)

Nothing else matters until a heartbeat proves in less than its own freshness
window. Every downstream cost — the proving service, the adaptive offset, the
manual Seal paste — exists to work around this.

**Target: proof time under 300 s on hardware a user can reach.**

- Benchmark the current guest on a rented GPU, against the same two-phase
  pipeline. This is the one experiment to run before anything else.
- If a GPU lands it under the window, the proving service and the offset
  arithmetic can be deleted. That would remove most of the moving parts.
- If it does not, the alternative is changing *when* the clock is read rather
  than how fast the proof is. That is a protocol change, not a config change,
  and it needs a security review before it goes anywhere near mainnet.

**Exit criteria:** `npm run heartbeat:devnet` completes end to end without the
offset logic, and the proving service is either load-bearing or deleted.

## Phase 1 — Make the security argument hold up

Self-review found one real vulnerability. That is a reason for more review, not
enough.

- Commission an external audit covering the Anchor program, the guest, and the
  payout path. Budget for it before mainnet, not after.
- Fix the permissionless `resolve_challenge` grief vector: require an owner
  signature or a fresh proof when `is_alive` is false.
- Add fuzz or property tests for the share arithmetic and the rent-reserve
  boundary. The last-heir-takes-remainder logic is exactly the kind of code
  that hides an off-by-one.
- Document the trust assumptions explicitly: the treasury PDA, the router PDA
  holding the verifier upgrade authority, and who can upgrade what.

**Exit criteria:** audit report published, findings fixed and disclosed, grief
vector closed.

## Phase 2 — Decide what the proof is for

This is a product decision that should be made deliberately, not inherited.

The proof currently gives attestation: only the pinned guest could produce an
accepted journal. It does not hide that a given vault owner is alive.

- Either accept attestation as the product and say so plainly, or
- Change the guest to commit only a commitment over the whole input, with the
  timestamp checked inside the guest, so liveness is not published.

The second is the honest version of the privacy claim the README used to make.
It is a real design change, not a tweak.

**Exit criteria:** the stated privacy properties match what the code does.

## Phase 3 — Mainnet, conservatively

- Deploy to mainnet behind a guardian multisig, with the upgrade authority held
  by a timelock.
- Seed with a small vault cap so an early bug cannot drain anything meaningful.
- Publish addresses and verification commands on day one.
- Run a bug bounty before announcing.

**Exit criteria:** mainnet deployment verified on-chain, bounty live, cap in
place.

## Phase 4 — Something people can actually use

Right now operating DeathClock requires understanding Groth16 seals. That is the
gap between a good demonstration and a product.

- A running prover nobody has to think about. Wallet-triggered if possible.
- Remove the manual Seal path once the proving service is trustworthy.
- SPL token support — correctly funded this time: deposit must wrap or mint
  real token liquidity, so release cannot pay out nothing.
- Heir-side UX: the person inheriting should be able to see and claim without
  running infrastructure.
- Clear legal positioning. Inheritance and asset transfer carry jurisdictional
  questions that need a real answer, not a paragraph in a README.

**Exit criteria:** a non-technical user can create an estate and an heir can
claim, without touching a terminal.

---

## What an investor will actually ask

Worth answering before anyone asks.

**"Who is the user?"** Today: a technically sophisticated holder thinking about
their own death who will run a Docker pipeline. That is a small population.
The real market is everyone with self-custody who wants beneficiaries without
the paperwork. The gap between those two is the business.

**"Is the ZK necessary?"** Possibly not for the heartbeat specifically —
attestation is roughly what a signature would give. It may be worth keeping for
the *absence* proof and the composition story, but the honest answer has to be
worked out, and it is a credibility question the moment an investor asks it.

**"What stops a false release?"** The challenge period, the 48-hour window, and
the fact that recovery is always available. This is the strongest part of the
design and should lead every pitch.

**"Is this legal advice or a trust company?"** Unclear today, and it needs to be
clear before anyone puts real money in. This is a gating question, not a
footnote.

**"Why you?"** One developer with a verified on-chain ZK path and a public
postmortem is a credible answer. It is not a moat.

---

## Deliberately not on this list

- Token incentives or a DAO. Not needed for this product.
- Multi-chain. Solana only until the core is safe.
- A mobile app. The web path is the hard part; a wallet should come after.

---

## Honest summary

The technical core works and is verifiable. The blockers are proving speed,
security review, and product fit — in that order. The most valuable thing to
do next is the GPU benchmark in Phase 0, because its result changes how much of
everything after it needs to exist.