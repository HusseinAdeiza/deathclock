# DeathClock — Crypto World's Fair submission

- **Project:** DeathClock — verifiable inheritance on Solana
- **Repository:** https://github.com/HusseinAdeiza/deathclock (public, Apache-2.0)
- **Live app:** https://deathclock-protocol.vercel.app
- **Track:** Solana
- **Submission deadline:** 11:59pm PT, October 12, 2026

This document is organised against the six published judging criteria so a
judge can find the evidence for each without hunting.

---

## 1. Functionality — "how well does it work, what is the quality of the code"

**It works on public devnet, and the proof runs inside the Solana VM.**

The claim that matters: this is not a mock verifier or an off-chain signature
check. A Groth16 proof is verified on-chain through the real path.

```
DeathClock::heartbeat -> verifier_router::verify -> groth_16_verifier::verify
```

- **Live transaction:** [`3KuQVp5k…`](https://explorer.solana.com/tx/3KuQVp5kLnAetbQsXKA2US1A2uY6FPNtEYGn6hQQkSgn7Mio9MriCdtnLeVEXiQsrKk3juzypfr8vtKDUfK7tiji?cluster=devnet)
- **Compute:** 183,194 of 200,000 CU, `err: None`
- **The BN254 pairing check executes in the Solana VM.** Not asserted off-chain.

Every claim in this section is independently reproducible:

```bash
npm run verify:deploy      # reads the loader accounts, prints last_deployed_slot
npm run verify:live-vault  # decodes the funded vault through the site's own path
npm run check:ids          # re-derives every recorded program ID and PDA
```

`verify:deploy` exists because a successful deploy proves nothing — Solana's own
tooling notes that the signature is not the deployment. It reads the ProgramData
account and confirms the program executes from the expected slot.

**A real security bug, found and fixed.** Reviewing the release path before
submission surfaced a payout-redirection flaw: `release_inheritance` credited
`ctx.remaining_accounts[index]` without binding it to the recorded heir, and had
no signer. Any caller could redirect an heir's inheritance to an arbitrary
account while the emitted event still named the registered heir. Two guards were
added (`HeirAccountMismatch`, `UnsafePayoutAccount`), regression-tested, and
deployed at slot `505959380`. The write-up is in the git history; the guard is
in the deployed bytecode.

**Honest limits, documented rather than hidden:**

- The browser cannot prove. Proving needs the RISC Zero toolchain in Docker, so
  the app takes a genuine receipt from a proving service or accepts one pasted
  in. It never fabricates a proof — that distinction is enforced in the UI.
- A real Groth16 proof takes **372–461 s** on this hardware. The freshness
  window is 300 s, so the offset has to be derived from measured proof times.
  This is why an external proving service exists.
- The payout path moves lamports, not SPL tokens. An SPL migration was
  attempted and reverted; `docs/MIGRATION-NOTES.md` explains that changing only
  the payout accounting would mark an estate released while paying nothing.
- **`resolve_challenge` is permissionless.** It takes `is_alive` from any caller,
  so after the 48-hour challenge anyone can push a vault to `Release` without the
  owner's consent. The owner can always recover via `heartbeat` or
  `emergency_recover`, so this cannot steal funds, but it is griefable and the
  fix (require an owner signature when `is_alive` is false, or accept a fresh
  proof) is not deployed. Reported in the audit thread rather than fixed under
  demo pressure.
- **The heartbeat does not hide liveness.** See the privacy note above.

`docs/POSTMORTEM.md` records what failed and why, including a two-hour
airdrop-blocked deployment that could only be solved from a second machine.

## 2. Potential impact — "how big is the addressable market"

Roughly **$140 billion in Bitcoin is unreachable** — lost seed phrases,
deceased holders with no executor, hardware wallets nobody can open. Crypto made
value transferable but did nothing for succession.

Every existing path requires a lawyer, a court, or a trusted intermediary. None
lets you pre-authorize a release policy while you are still well, which is the
period when it is cheap to set up and impossible to obtain later.

**Ecosystem fit.** DeathClock composes with existing primitives rather than
replacing them:

- RISC Zero for proving, via the standard `verifier_router` selector dispatch
- Anchor for the program, standard PDAs for vaults and treasury
- Plain lamports in a PDA vault — no novel asset type, no custody assumption

The vault is an ordinary program-owned account. If DeathClock were abandoned, the
funds stay in the PDA and the heirs' names are on-chain; nothing depends on a
server the team controls.

**Business model:** 0.5% of the distributable balance, charged once at release,
never on deposits, heartbeats, or a recovered false alarm. The owner pays
nothing while alive.

## 3. Novelty — "how unique is the concept"

The design constraint that distinguishes DeathClock is the **false alarm**.

Anyone can stop sending heartbeats to trigger a payout. So a heartbeat must be a
*proof of life*, not an absence of activity — and a release must survive the
owner showing up late. DeathClock's state machine is built around exactly that:

```
Active -> (heartbeat expires) -> Missed -> Challenged -> (owner proves alive / recover) -> Active
                                                  -> (48h elapsed, death confirmed) -> Release -> Released
```

The heartbeat commits to `SHA-256(owner || timestamp_le || nonce)`, so the
verifier learns *that* the owner is alive and nothing else. The timestamp must be
within 300 s of chain time, which is what makes a replayed receipt worthless.

**On privacy, precisely:** the heartbeat proves *attestation*, not secrecy. The
guest commits the owner key, timestamp, and nonce in the clear, and
`journal_outputs` is a public transaction argument, so a heartbeat does **not**
hide that a given vault owner proved they were alive. What it guarantees is that
only the pinned guest could produce an accepted journal, bound to the owner and
the cluster clock. Hiding liveness would mean committing only a commitment and
checking the timestamp inside the guest — a real design change, listed under
"what is not done" rather than claimed as a feature.

## 4. UX — "how well does it use blockchain to create great UX"

The live vault is read straight from chain state and rendered as a console, with
the proof path exposed honestly rather than hidden behind a spinner.

- **Wallet connection was the hard part.** It was genuinely broken twice, and
  both root causes are in the git history: multiple `useState` stores meant the
  header connected a provider the app could not see, and every wallet namespaces
  its provider as `window.phantom.solana` — the code was calling `connect()` on
  the wrapper. Both are regression-tested (`npm run check:provider`).
- **Late wallet injection** is handled by polling, so a wallet that arrives
  after page load is still detected.
- **All 360 rendered colour pairs pass WCAG AA**, audited against composited
  alpha rather than treating transparent backgrounds as opaque — a mistake that
  initially hid two genuine failures.
- **A route error boundary** keeps the shell alive when one component throws,
  instead of replacing the page with a blank screen.

## 5. Open source — "is it open-source, does it compose with other primitives"

Public at https://github.com/HusseinAdeiza/deathclock, Apache-2.0.

**31 commits, all signed and verified** by `HusseinAdeiza`, sole contributor.
Every commit message explains *why*, including the reasoning behind reverted work.

The verifier source is **vendored** under `vendor/risc0-solana/` specifically so
the exact binary running on devnet is rebuildable from this repository. A judge
can rebuild the bytecode and compare it against the deployed ProgramData.

Third-party code and licenses are disclosed in `THIRD-PARTY-NOTICES.md`, including
the two local modifications to the vendored router and why they were needed.
Compose points: standard Anchor PDAs, the standard RISC Zero selector dispatch,
and plain lamport transfers — no custom primitives required.

## 6. Business plan — "is there a viable business, how adept is the team"

**The product:** self-serve estate setup for anyone holding crypto, with no
intermediary. The user names heirs, sets shares, and funds a vault. The protocol
does the rest.

**Why it is viable:** the fee is collected exactly once, at the moment value
actually moves and the heirs would otherwise need an executor. No ongoing
custody, no subscription, no operational cost per user — the vault is a PDA.

**Distribution:** the addressable entry point is every self-custody user who
wants beneficiaries but not the paperwork. The design decision that matters for
adoption is that **the owner pays nothing while alive** — a product that bills
people monthly for a policy they never intend to claim is a hard sell, and this
one does not.

**Execution, honestly assessed.** This was built by one developer. What that
produced is verifiable: a real on-chain proof path, a self-audited security
fix, and a reproducible build. What it has not produced is an audit, a user
study, or an incident history — the postmortem documents the first absence
explicitly rather than implying otherwise.

## What is not done

Stated plainly, because a judge will check:

- **No third-party security audit.** A self-review found and fixed one real
  vulnerability; that is not a substitute.
- **No mainnet deployment.** Everything verified here is devnet.
- **The proving service is unauthenticated** and does not survive a reboot.
  Production runs the manual-receipt path rather than exposing it.
- **The SPL token payout is not implemented.** Documented in
  `docs/MIGRATION-NOTES.md` with the reason it was reverted.

## Reproduce it

```bash
npm run check:ids          # program IDs and PDAs re-derive
npm run verify:deploy      # deployed slot, authority, bytecode size
npm run verify:live-vault  # 0.4 SOL vault, two heirs at 60/40
npm run heartbeat:devnet   # a real Groth16 proof, end to end (~7 min)
```

Live app: https://deathclock-protocol.vercel.app
Full technical detail: [`README.md`](README.md) · [`docs/POSTMORTEM.md`](docs/POSTMORTEM.md)