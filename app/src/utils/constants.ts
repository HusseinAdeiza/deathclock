// Program ids are devnet addresses, verified on-chain as executable and owned
// by BPFLoaderUpgradeab1. Keep in sync with scripts/program-ids.ts.

const DEVNET_PROGRAM_ID = "C8unxtjoDZWy2GmwHUPuSve1BHT5TtRKpNaDofbMS5Vh";

export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || DEVNET_PROGRAM_ID;

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

/** `devnet` | `localnet`, used only for explorer links. */
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "devnet";

export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL || "https://explorer.solana.com";

// Overridable so a demo can walk the state machine in minutes. The program
// accepts any positive interval, so this is presentation only.
function positiveSeconds(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const HEARTBEAT_INTERVAL = positiveSeconds("NEXT_PUBLIC_HEARTBEAT_INTERVAL", 30 * 24 * 60 * 60);
export const CHALLENGE_PERIOD = positiveSeconds("NEXT_PUBLIC_CHALLENGE_PERIOD", 48 * 60 * 60);
export const FEE_BPS = 5;

/** Explorer deep link for an address or signature on the configured cluster. */
export function explorerLink(kind: "address" | "tx", value: string): string {
  const cluster = NETWORK === "localnet" ? "" : `?cluster=${NETWORK}`;
  return `${EXPLORER_URL}/${kind}/${value}${cluster}`;
}
