# Vendored: risc0-solana

Source: https://github.com/boundless-xyz/risc0-solana
License: Apache-2.0 (see `LICENSE` in this directory)

Copied into the repository so the `verifier_router` and `groth_16_verifier`
bytecode that runs on devnet can be rebuilt and compared against the deployed
ProgramData accounts.

Two local changes, both required for the deployment described in `docs/DEPLOYMENT.md`:

1. `solana-verifier/programs/verifier_router/build.rs` reads an `INITIAL_OWNER`
   environment variable to bind the router's upgrade authority at build time,
   defaulting to the system program when unset.
2. Programs are deployed at fixed addresses so the frontend IDL and the router's
   `INITIAL_OWNER` agree across rebuilds.

Verification logic, the BN254 pairing check, and selector dispatch are
unmodified. Everything DeathClock adds lives in `programs/deathclock/`.
