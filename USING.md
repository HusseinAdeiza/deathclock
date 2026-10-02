# Using DeathClock

**You do not need to read any code, run a terminal, or understand cryptography
to use this.** If you can send money from a Solana wallet, you can set up an
estate.

If you are a developer looking for the technical detail, start with the
[README](README.md) instead. This page is for everyone else.

---

## What it does

You put SOL into a vault. You name the people who should get it. Once a month
you send a short receipt that says you are alive. If you stop sending those
receipts and nothing happens for 48 hours, the money goes to the people you
named, automatically.

Nobody has to be trusted to do this — not a lawyer, not a company, not you. The
blockchain checks the receipt for itself.

---

## The five steps

### 1. Connect your wallet · 10 seconds

Click **Connect** at the top right and choose Phantom. That is the whole step.

It proves you hold your keys. This site never sees your private key — signing
happens inside your wallet, and anything that costs money asks you to confirm.

### 2. Say who inherits · 2 minutes

Add up to five people and give each one a share. Shares must total exactly 100%.

Get these right the first time. **There is no way to edit the heirs later** —
the vault is created once and the split is fixed.

> Use a real wallet address for each person. A typo here means the money goes
> somewhere you cannot undo, and you cannot correct it.

### 3. Put the money in · 1 minute

Deposit SOL. The balance appears as soon as the transaction confirms.

> **Important, and easy to misread:** you can add to the vault, but you cannot
> take money back out. There is no withdrawal instruction in the program yet.
> Put in only what you genuinely intend to leave.

### 4. Send a monthly receipt · several minutes

This is the part people ask about. Every 30 days you send a proof that you are
alive. The blockchain verifies it on its own — nobody has to take your word for
it, and no company is in the middle.

> **Being straight with you:** on an ordinary laptop this takes between four and
> eight minutes to produce, which is not yet fast enough to do comfortably every
> month. We are working on it — a GPU prover is the fix, and it is the first item
> in the [roadmap](docs/ROADMAP.md). Everything else here works today.

### 5. If you stop sending receipts · 48 hours

After 30 days without one, anyone can report it. **Your money does not move.**

Instead a 48-hour window opens. If you send a receipt during that time,
everything resets as if nothing happened.

That delay is the entire point. A dead battery, a flat line, or a week without
internet cannot hand your estate to someone else. Money only moves after 48
hours of genuine silence.

---

## Questions people actually ask

**Can I take the money back out?**
Not right now. The program supports deposits but has no withdrawal instruction,
so what you put in stays in until the estate is released. This is the single
biggest gap in the product and it is first on the
[roadmap](docs/ROADMAP.md). On devnet this costs you nothing, since the coins
are worthless.

**What if I make a mistake, like a typo?**
The heirs cannot be edited after the vault is created. If you get an address
wrong, the practical fix is to let it run its course or create a fresh vault —
so check every address carefully before depositing.

**Does this replace a will?**
No, and it should not be treated as one. This decides who gets the crypto, and
only the crypto. Property, dependents, tax, and anything contested still belong
with a lawyer.

**Who can see my estate?**
Anyone can see that a vault exists, who the heirs are, and roughly how much is
in it. That is the honest answer, and it is documented in the
[technical write-up](README.md#how-the-heartbeat-works) rather than hidden.

**What does it cost?**
Nothing while you are alive. A 0.5% fee is charged once, only at the moment
money actually moves to your heirs, and it is taken before the split — so it
does not reduce anyone's share.

**Is this safe to use with real money?**
**Not yet.** This runs on Solana **devnet**, where the coins are test coins with
no value. There has been no outside security review. Use it to see how the idea
works — not to protect anything you would miss.

---

## Why the receipt is a real proof

This is the one technical point worth making, because it is what separates this
from a normal "dead man's switch."

A dead man's switch usually means: stop sending messages, and something happens.
That has a failure mode — you stop sending messages because your phone died, or
you were on a flight, or you simply forgot for three weeks.

DeathClock inverts it. The receipt proves **the owner is alive**, not that
something stopped. And a false alarm never moves money, because of that 48-hour
window.

The receipt is a zero-knowledge proof (RISC Zero, Groth16), checked by Solana
itself: the pairing calculation runs inside the virtual machine, not on a
server. Transaction
[`3KuQVp5k…`](https://explorer.solana.com/tx/3KuQVp5kLnAetbQsXKA2US1A2uY6FPNtEYGn6hQQkSgn7Mio9MriCdtnLeVEXiQsrKk3juzypfr8vtKDUfK7tiji?cluster=devnet)
uses 183,194 of 200,000 compute units and finishes clean.

**What it does not hide:** the receipt is public, so anyone can tell that a
particular vault owner proved they were alive. It proves authenticity, not
privacy. That is documented rather than glossed over — see
[Privacy is not what you think](#privacy-is-not-what-you-think).

---

## Privacy is not what you think

We would rather tell you this than have you find out later.

A proof of death is broadcast to everyone. So is a proof of life. The receipt
commits the owner key, the timestamp, and a nonce in the clear, and the vault
emits an event naming the owner. Anyone watching the chain can see that a given
vault owner proved they were alive, and build a history of it.

What the proof *does* guarantee is narrower and still real: only the committed
program running on the pinned image can produce a receipt the chain accepts, and
the chain binds it to the vault owner and the live clock. A replayed or stale
receipt is worthless.

Hiding liveness properly would mean committing only a commitment, with the
timestamp checked inside the proof. That is a real redesign, not a tweak, and it
is on the roadmap.

---

## What is not finished

Stated here rather than buried:

- **Devnet only.** No mainnet deployment. Test coins.
- **No outside audit.** We found and fixed one real vulnerability in our own
  code; that is a reason for more review, not a substitute for it.
- **The monthly receipt takes 4–8 minutes** on ordinary hardware.
- **Payouts move SOL, not other tokens.**

The [roadmap](docs/ROADMAP.md) has the full picture, and
[POSTMORTEM.md](docs/POSTMORTEM.md) documents what went wrong along the way.

---

## For developers

Everything above runs against a real program on devnet. If you want to verify any
claim on this page yourself:

```bash
npm run verify:deploy      # the deployed program's slot and authority
npm run verify:live-vault  # decode a funded vault, same path the site uses
npm run check:ids          # every program id and PDA re-derives
```

Start with the [README](README.md) for architecture, and
[docs/DEMO.md](docs/DEMO.md) for a judge-facing walkthrough.