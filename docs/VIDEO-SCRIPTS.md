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

### Before you record — build the demo version

The heartbeat cannot be shown live: it takes 4–8 minutes against a 300-second
window. But **the inheritance path needs no proof at all.** `report_death`,
`initiate_challenge`, `resolve_challenge`, and `release_inheritance` are all
proof-free — only `heartbeat` requires one.

So build short intervals and walk the whole lifecycle live:

```bash
cd app
NEXT_PUBLIC_HEARTBEAT_INTERVAL=120 NEXT_PUBLIC_CHALLENGE_PERIOD=90 npm run build
```

This is not a mock or a shortcut. It is the same state machine with a shorter
clock, and the lamports that move are real devnet lamports.

### Beat 1 — one person, not a statistic (0:00–0:20)

> A man has a hardware wallet. He dies. His children cannot open it, and the
> money is gone forever.
>
> That happens with about a hundred and forty billion dollars of Bitcoin.
>
> DeathClock is what he should have set up when he was well.

Do **not** open with the $140 billion. Open with the person.

### Beat 2 — what it is (0:20–0:40)

> You deposit, you name who inherits, and once a month you prove you're alive.
>
> Stop proving it, and after 48 hours the money goes to them.
>
> The interesting part is what happens in between.

### Beat 3 — set it up (0:40–1:00)

**Do this live.** Connect Phantom, add two heirs at 60/40, deposit.

> One vault, two heirs, sixty-forty. That's it.

### Beat 4 — the missed heartbeat (1:00–1:25)

Wait out the 120-second interval, then report the missed heartbeat.

> The interval lapsed, so it's reported. Watch what does **not** happen.

### Beat 5 — nothing moved (1:25–1:55) ← the beat that wins it

**Slow down here. Let the numbers sit on screen.**

> Nothing. No money moved. The funds are still in the vault.
>
> This is the part that matters. Anyone can pay out after a death. The hard part
> is refusing to pay out after a false alarm — a dropped connection, a flat
> battery, three weeks away.
>
> So the heartbeat isn't just a signal. It's a proof that the owner is alive.
> Stopping it doesn't trigger a payout. It opens a question.

### Beat 6 — the challenge window (1:55–2:20)

Start the challenge, show the countdown.

> 48 hours. If the owner produces a valid proof in that window, everything
> resets and the estate stays his. If not, it's released.
>
> A false alarm costs the reporter nothing and the owner everything to fix.
> That asymmetry is deliberate — it means griefing is bounded by the clock.

### Beat 7 — release (2:20–2:50)

Let the window expire, resolve as deceased, release.

> Heirs don't sign anything, don't approve anything, don't even have to know
> this exists. The addresses were recorded at creation.

**Point at the heir balances.** Show both wallets received their share, and
show the 0.5% fee as a separate line.

### Beat 8 — close (2:50–3:00)

> The proof that makes the heartbeat real runs on RISC Zero and is verified
> inside the Solana VM — 183,000 of 200,000 compute units. It takes four to
> eight minutes, which is the real bottleneck, and a GPU is the fix.
>
> Repo's open, including the postmortem.

**Screen:** github.com/HusseinAdeiza/deathclock

---

## If you want to show the proof instead

You have 3 minutes and a proof that needs 4–8. Don't. Cut it to a screen
capture of the verified transaction and one sentence:

> This is the verified heartbeat. It ran on devnet.

[`3KuQVp5k…`](https://explorer.solana.com/tx/3KuQVp5kLnAetbQsXKA2US1A2uY6FPNtEYGn6hQQkSgn7Mio9MriCdtnLeVEXiQsrKk3juzypfr8vtKDUfK7tiji?cluster=devnet)

---

## Things that will go wrong, and what to do

| Problem | Do this |
|---|---|
| Wallet says "no vault" | You forgot the short-interval build. `npm run build` again. |
| Interval already lapsed before you record | Fine — skip to beat 4. |
| Challenge period feels long | It is 90 seconds. Narrate the wait. |
| Deposit looks slow | Devnet. Narrate over it, don't cut the recording. |
| Phantom won't connect | Hard-refresh. Confirm devnet SOL first. |
| A typo in a tx signature | Say "I'll put the link in the description." |
| Site looks stale | `Ctrl+Shift+R` before recording, not during. |

**Heir balances won't update instantly.** SOL transfers take a couple of seconds
to land. Have the heir tabs open so you can switch and show the funds arriving —
that shot is the whole video.

**If something breaks mid-take, keep going.** A video with one honest stumble
beats a retake where your voice is off. Cut in editing instead.

---

# 2. Pitch video — 2 minutes

**Different purpose.** This one is you and the idea. No screen recording needed —
face to camera is better. "Why are you the people to build this."

**Setup:** neutral background, look at the lens, no notes on screen. Memorize the
five beats, don't read them.

---

### 0:00–0:20 — one person, not a statistic

> A man holds a hardware wallet. He dies. His children can't open it.
>
> That story is worth about a hundred and forty billion dollars of Bitcoin, but
> the number isn't the point — the point is that he could have set it up
> himself, while he was well, in about two minutes.
>
> I'm building DeathClock. It's why that wallet would have opened.

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
> The challenge window means a false alarm can never move money. And
> `release_inheritance` takes no signature — the heirs never have to approve
> anything, or even know the vault exists. The addresses were recorded at
> creation, while he was well enough to be sure.

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