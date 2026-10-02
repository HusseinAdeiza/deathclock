# Video scripts

Two videos. **Record the demo first** — it does the heavier lifting on judging
criterion (a), "how well does this work."

Total recording time should be about 90 minutes including retakes. Both are
scripted beat by beat so you don't have to think while recording.

---

# 1. Demo video — 3 minutes

**The rule:** show the live product, not slides, not a code walkthrough. A
judge wants to see it *work*.

**Before you record**
- Hard-refresh https://deathclock-protocol.vercel.app (`Ctrl+Shift+R`)
- Phantom funded with devnet SOL
- Close every other tab and notification
- Record at 1920×1080, 30fps

---

### Beat 1 — the problem (0:00–0:25)

> About 140 billion dollars in Bitcoin is unreachable. Lost seed phrases,
> deceased holders with no executor, hardware wallets nobody can open.
>
> Crypto made value transferable but did nothing for succession.

**Screen:** the landing page, scrolling slowly.

---

### Beat 2 — what DeathClock does (0:25–0:50)

> DeathClock lets you name who inherits your crypto. You deposit, you name your
> heirs, and once a month you send a receipt that proves you're alive.
>
> Stop sending them, and after 48 hours the money goes to the people you named.
> No lawyer, no custodian.

**Screen:** scroll to **How to use** — this is the section you added. Let it sit
for a beat. This is the "non-developer can use it" evidence.

---

### Beat 3 — create the estate (0:50–1:20)

**Do this live. Do not cut.**

1. Click **Connect** → **Phantom**
2. Your address appears top-right
3. Add two heirs — use two spare devnet addresses
4. Shares **60** and **40**
5. Create the vault

> Here's me doing it now.

**Note:** say out loud that shares must total 100% and **cannot be edited after
creation**. If a judge spots that gap first, you look defensive; if you say it
first, you look careful.

---

### Beat 4 — the vault console (1:20–1:45)

**Screen:** the vault console showing the live vault.

> This isn't a mock. Every number here is read straight off the Solana devnet
> chain. Balance, state, heirs, shares, and the challenge window.

**Point at the existing devnet vault** if the console shows it — 0.4 SOL, two
heirs. That's a real funded vault someone can verify in Explorer.

---

### Beat 5 — the honest limitation (1:45–2:20)

**This is the most important beat in the video.** Do not skip it.

> Now the part I want to be upfront about. Sending a real heartbeat takes four
> to eight minutes on ordinary hardware. That's because it produces a genuine
> zero-knowledge proof — the pairing check runs inside the Solana VM, 183,000 of
> 200,000 compute units — and the proof has to be fresh within 300 seconds.
>
> So the proof takes longer than the window it's allowed to live in. That's the
> real bottleneck, and a GPU prover is the fix.

**Screen:** the proof panel. Let the timeout or the pending state show.

> I'm not going to fake it to look faster.

That sentence is doing more work than anything else you'll say.

---

### Beat 6 — the security fix (2:20–2:50)

> While building this I found a real vulnerability in my own payout code. It
> credited whatever accounts the caller passed in, without checking they were the
> registered heirs. Anyone could redirect someone's inheritance.
>
> It's fixed and deployed. Anyone can verify — `npm run verify:deploy` prints the
> on-chain slot the program is running.

**Screen:** terminal, or the GitHub commit. **Do not** show the local validator,
where the proof takes 40 minutes.

---

### Beat 7 — close (2:50–3:00)

> Repo's open, including the postmortem with everything that broke and why.
> Thank you.

**Screen:** https://github.com/HusseinAdeiza/deathclock

---

## Things that will go wrong, and what to do

| Problem | Do this |
|---|---|
| Heartbeat proof hangs | Expected. Say so, move to beat 5. |
| Phantom won't connect | Hard-refresh. Confirm devnet SOL first. |
| Deposit looks slow | Devnet. Narrate over it, don't cut the recording. |
| A typo in a tx signature | Say "I'll put the link in the description." |
| Site looks stale | `Ctrl+Shift+R` before recording, not during. |

**If something breaks mid-take, keep going.** A video with one honest stumble
beats a retake where your voice is off. Cut in editing instead.

---

# 2. Pitch video — 2 minutes

**Different purpose.** This one is you and the idea. No screen recording needed —
face to camera is better. "Why are you the people to build this."

**Setup:** neutral background, look at the lens, no notes on screen. Memorize the
five beats, don't read them.

---

### 0:00–0:20 — you and the problem

> I'm building DeathClock. A hundred and forty billion dollars in Bitcoin is
> unreachable — lost keys, people who died without a will, hardware wallets
> nobody can open.
>
> Succession in crypto still means a lawyer or a custodian. I think that's
> fixable.

---

### 0:20–0:50 — the hard part

Keep this tight and confident. It's the part that shows you understand the
problem.

> The hard part isn't paying out the money. It's the false alarm.
>
> Anyone can stop sending messages to trigger a payout. So a heartbeat has to
> prove the owner is alive — not just that something stopped happening.
>
> And if you show up late, the whole thing has to survive that.

---

### 0:50–1:20 — what you built

> I built it on Solana with RISC Zero. The heartbeat is a real zero-knowledge
> proof, verified on-chain — the pairing check runs inside the virtual machine,
> not on a server. There's a transaction you can look at that proves it.
>
> The challenge window means a false alarm can never move money.

---

### 1:20–1:45 — why me

This is the beat most people skip. Don't.

> While building it I found a real vulnerability in my own payout logic —
> anyone could redirect someone's inheritance to their own wallet. I fixed it,
> deployed it, and wrote up how I found it.
>
> I also wrote a postmortem with everything that broke, including the parts
> where I blamed the platform and I was wrong.

---

### 1:45–2:00 — the honest close

> What I haven't solved: the proof takes four to eight minutes, and it has to be
> fresh within five. That's the bottleneck, and a GPU is the fix.
>
> I'm building DeathClock. Happy to take questions.

---

## Delivery notes

- **Say the numbers slowly.** "183,000 of 200,000 compute units" — judges write
  these down.
- **Don't overclaim.** No "private." No "guaranteed." No "mainnet-ready." You
  lose far more credibility on one overclaim than you gain from the claim.
- **Pause after the problem statement.** Let it sit. That's the beat that makes
  them keep watching.
- **Two videos, one take each.** Perfection is not the goal. Clarity is.

---

## Checklist before you hit save

- [ ] Devnet SOL in Phantom
- [ ] Site hard-refreshed, working
- [ ] Two spare heir addresses ready
- [ ] Terminal open at the repo for beat 6
- [ ] Demo recorded, ≤3:00
- [ ] Pitch recorded, ≤2:00
- [ ] Uploaded, links in the Colosseum Media and code form

**Deadline: final submission opens October 6, 4:00 AM PDT.**