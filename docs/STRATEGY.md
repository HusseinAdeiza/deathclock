# Hackathon strategy

Written the night before final submission opens, after reading what wins
hackathons and what won the Devpost/XPRIZE Gemini gallery.

---

## The one finding that changes the demo

I checked whether the inheritance path needs a ZK proof. It does not.

```
report_death          no proof
initiate_challenge    no proof
resolve_challenge     no proof
release_inheritance   no proof
heartbeat             the ONLY instruction that needs one
```

So the entire state machine — missed heartbeat, challenge, release, and money
actually moving to heirs — is demonstrable in four minutes with a short
interval build. No proof, no timeout, nothing to fail on camera.

**This is the demo.** Not the heartbeat.

The heartbeat is the interesting *technical* claim and the weakest *demo*. It
takes 231–461 seconds against a 300-second freshness window, so it cannot be
shown live without looking broken. I have been planning a video that leads with
the thing that will fail. That was the wrong call.

Build with `NEXT_PUBLIC_HEARTBEAT_INTERVAL=120 NEXT_PUBLIC_CHALLENGE_PERIOD=90`
and the whole lifecycle runs in front of a judge with real lamports moving.

## What the advice actually says

Six tips from a competitor with an 80–90% win rate. Ranked by how much they
change what I should do:

**"Packaging is almost 50% of the submission."** — This is the one that
applies most. Everything else on my list is already done.

**"Everything you present should be truly functional, don't fake stuff just to
make your submission look bigger."** — This is exactly why the demo must be the
proof-free state machine rather than a hero shot of the proof pipeline. A
half-working heartbeat with a spinner reads worse than a clean four-minute
inheritance.

**"Polish. Be VERY detail oriented."** — The console renders a real vault at
`0.40221488 SOL` with two heirs at 60/40. That precision is an asset. Round
numbers would read as a mock.

**"Don't do more than you need. Having the right working pieces is far superior
than many pieces that are not fully fitting together."** — I have a proving
service, a manual Seal paste path, three npm check scripts, a demo-build
override, a state walkthrough, and a how-to-use section. That is more than a
judge will hold in their head. The demo should use at most three of them.

**"Idea is the most important thing."** — This is where DeathClock is
genuinely strong and I should stop hedging it. A death-triggered release that
*cannot* be griefed, because a false alarm costs nothing and the owner always
retains a recovery window, is a real idea with a real constraint behind it.
Every competitor here is an AI wrapper around a workflow. None of them have a
hard adversarial constraint driving the architecture.

**"You don't need a team anymore."** — Not actionable, and not something to put
in a submission. It reads as an excuse.

## What the Devpost gallery tells us

Twenty-four winners, all Gemini-prize eligible. The pattern is not technical
cleverness. It is **a specific person with a specific problem**:

- TaskRabbit for Nigeria's informal artisan economy, where 93% of workers have
  no way to get paid safely
- VAT credit recovery for Mexican businesses
- a small dental clinic's operating system, running offline on its own hardware
- Venezuela's wholesale agriculture market, pricing crops from real transactions
- a barber shop AI workforce for customer retention

Nobody won with a large addressable market. The ones with the sharpest wedge are
small, named, and immediately obvious.

**DeathClock says "$140 billion in Bitcoin is unreachable."** That is a
market-size claim, and it reads like every other crypto pitch. The gallery says
lead with the person.

The sharper version: *a father in Lagos with a hardware wallet his children
cannot open.* One person. One wallet. One reason it stays shut.

## What I would change

**The demo video, entirely.** Lead with the live inheritance, not the proof
pipeline:

1. Create a vault, name two heirs, deposit
2. Let the short interval lapse
3. Report the missed heartbeat
4. Show that **no money moved** — this is the beat that proves the design
5. Open the challenge window
6. Let it expire, resolve as deceased
7. **Show the lamports arrive in both heir wallets, with the 0.5% fee visible**

Step 4 is the whole argument. Anyone can pay out after a death; the hard part is
refusing to pay out after a false alarm. Show the refusal, then show the payout.

**The pitch opening.** Cut the $140 billion. Lead with the person and the
constraint. Keep the number later as support, not as the hook.

**One claim to add.** `release_inheritance` takes no signer, so heirs never need
to cooperate or even know the vault exists — the money moves to addresses already
recorded at creation. That is a genuine property worth saying out loud.

## What not to change

- The postmortem. Self-critical rigour is the opposite of AI slop.
- Devnet-only and not audited, stated plainly. Point 4 of the advice is
  "don't fake," and volunteering your own limits is the same principle.
- The repo as it is. 41 commits, every one signed, the fix and the reversal both
  documented. That is what a real project history looks like.

## Honest assessment

The advice in point 1 — build something that can go viral — is mostly a
function of luck and timing. I cannot manufacture that in 36 hours and I would
be overclaiming if I said otherwise.

What I can control is the last 40%: a demo that runs clean end to end, a
submission where every claim is checkable, and an idea with a real constraint
behind it. That is a better position than it was this morning, and the gap
between it and a winner is probably not something I can close.

## The one thing to do first

Record the demo as a live inheritance on the short-interval build. Everything
else in the submission is already written and verified.