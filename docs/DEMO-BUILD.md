# Demo build — intervals short enough to walk live

The production defaults are a 30-day heartbeat and a 48-hour challenge, which
is right for the protocol and useless on stage: a judge cannot watch a vault go
Active -> Missed -> Challenged -> Release in real time.

`NEXT_PUBLIC_HEARTBEAT_INTERVAL` and `NEXT_PUBLIC_CHALLENGE_PERIOD` override both
at build time. The on-chain program accepts any positive interval, so this is a
presentation choice -- the state machine walked is identical, only the clock
differs.

| Build | Interval | Challenge | Use |
|---|---|---|---|
| default | 30d | 48h | production, judges reading the repo |
| demo | 120s | 90s | live walkthrough |

```bash
# demo
NEXT_PUBLIC_HEARTBEAT_INTERVAL=120 NEXT_PUBLIC_CHALLENGE_PERIOD=90 npm run build

# production
npm run build
```

A vault keeps the interval it was created with, so switching builds does not
alter existing vaults. Create a fresh one after switching.

Check the rendering with `npm run check:demo`, which pins both the production
defaults (so they cannot drift) and the demo-scale values.