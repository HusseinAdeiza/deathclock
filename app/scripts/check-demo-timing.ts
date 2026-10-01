/**
 * Checks the interval rendering and the build-time timing override.
 *
 * Both exist so a demo can walk Missed -> Challenged -> Release in minutes. A
 * wrong number on screen during a live demo is worse than no number, so these
 * are pinned rather than eyeballed.
 *
 * Run: npm run check:demo
 */
import { formatDuration } from "../src/utils/helpers";
import { HEARTBEAT_INTERVAL, CHALLENGE_PERIOD } from "../src/utils/constants";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${ok ? "" : `\n        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}`);
}

console.log("production defaults render as days and hours");
check("30 days", formatDuration(30 * 86_400), "30d");
check("48 hours", formatDuration(48 * 3_600), "48h");

console.log("\ndemo-scale intervals render readably, not as 0.0017 days");
check("120s interval", formatDuration(120), "2m");
check("90s challenge", formatDuration(90), "90s");
check("45s", formatDuration(45), "45s");
check("1 hour", formatDuration(3_600), "1h");

console.log("\ndegenerate values do not produce NaN or empty output");
check("zero", formatDuration(0), "0s");
check("negative", formatDuration(-5), "0s");
check("NaN", formatDuration(Number.NaN), "0s");

console.log("\nthe shipped defaults are the production values");
check("HEARTBEAT_INTERVAL", HEARTBEAT_INTERVAL, 30 * 24 * 60 * 60);
check("CHALLENGE_PERIOD", CHALLENGE_PERIOD, 48 * 60 * 60);

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("All demo-timing checks passed.");