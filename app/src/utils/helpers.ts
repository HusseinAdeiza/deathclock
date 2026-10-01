import { PublicKey } from "@solana/web3.js";

export const shorten = (value: string, size = 4) =>
  value.length <= size * 2 ? value : `${value.slice(0, size)}…${value.slice(-size)}`;

export const formatSol = (lamports: number) => {
  const value = lamports / 1_000_000_000;
  return value >= 1 ? value.toFixed(2) : value.toFixed(4);
};

export const vaultAddress = (owner: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync([Buffer.from("vault"), owner.toBuffer()], programId)[0];

export const stateLabel = (state: string) => {
  const labels: Record<string, string> = {
    active: "Alive / active",
    missed: "Heartbeat missed",
    challenged: "Challenge window",
    release: "Ready to release",
    released: "Distributed",
  };
  return labels[state] || state;
};

// A demo vault can use a minutes-long interval, which would render as
// "0.0017 days" if we always divided by 86400.
export const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  // 48h stays in hours. "2d" would read like a different policy.
  if (seconds % 86_400 === 0 && seconds / 86_400 >= 7) return `${seconds / 86_400}d`;
  if (seconds % 3_600 === 0) return `${seconds / 3_600}h`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${Math.round(seconds)}s`;
};
