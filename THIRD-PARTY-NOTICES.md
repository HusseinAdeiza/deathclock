# Third-party code

The Crypto World's Fair rules (§9) require entrants to disclose the status and
ownership of third-party code in a submission. This is that disclosure.

## Vendored: `risc0-solana`

- **Upstream:** https://github.com/boundless-xyz/risc0-solana
- **License:** Apache-2.0
- **Vendored:** copied into `vendor/risc0-solana/` (`solana-ownable/`,
  `solana-verifier/`)
- **Why vendored:** the on-chain binary must be reproducible from this
  repository alone. The deployed `verifier_router` and `groth_16_verifier`
  programs are built from exactly these files, so a judge can rebuild the
  bytecode that runs on devnet and compare it against the deployed ProgramData.

### Modifications

Apache-2.0 §4(b) requires modified files to carry prominent notices. Two
changes were made, both visible in the git history:

1. `verifier_router/build.rs` — takes an `INITIAL_OWNER` environment variable
   to bind the router's upgrade authority to a known address at build time,
   defaulting to `11111111111111111111111111111111` when unset. This is what
   let the router PDA take the verifier's upgrade authority via the top-level
   LoaderV3 `SetAuthority` route.
2. Program addresses were deployed at fixed devnet addresses rather than the
   generated ones, so the frontend IDL and the router's `INITIAL_OWNER` agree
   across rebuilds.

Upstream source is unmodified in substance: the verification logic, the BN254
pairing check, and the selector dispatch are untouched. Everything DeathClock
adds on top lives in `programs/deathclock/`.

The vendored copy omits upstream's own `LICENSE` file. The Apache-2.0 terms
are reproduced at the repository root in `LICENSE`, and apply to this vendored
subtree as well as to DeathClock's own source.

## Dependencies

Everything else is declared in `Cargo.toml`, `package.json`, and
`Cargo.lock` with its upstream version and license:

- **Anchor 0.32.2** (Apache-2.0) — Solana program framework
- **`@solana/web3.js`** (Apache-2.0) — client library. Declared as `^1.87.0`,
  resolved to 1.99.0 in `package-lock.json`.
- **RISC Zero zkVM** — `risc0-zkvm` 3.0.6 and `risc0-groth16` 3.0.5
  (Apache-2.0 OR MIT), used by the guest program in `zk/`
- **Next.js 14** (MIT) — frontend framework

## Fonts

The frontend loads two families from Google Fonts (Fraunces and a monospace
face). Both are SIL Open Font License 1.1, served from Google's CDN at
runtime rather than vendored.

## Solana programs

| Program | Address | Role |
|---|---|---|
| `deathclock` | `C8unxtjoDZWy2GmwHUPuSve1BHT5TtRKpNaDofbMS5Vh` | vault, heartbeat, release |
| `verifier_router` | `5n8zx79RUHafwSSB4vRU5ao9atHzJQHTdJR9ty8YrVte` | selector dispatch |
| `groth_16_verifier` | `2iPoTWMXWJ6inLnBeGEZyiKkwEzaQvCX24Cp82UcWm8K` | BN254 pairing check |

All on devnet. `npm run verify:deploy` reads the loader accounts and prints the
`last_deployed_slot` for each.

## Deployment credentials

None are in this repository. The program keypairs live in `target/devnet/`,
which is gitignored, and the Vercel token is in your shell environment. If you
clone this and see a key, it came from your own machine.