/**
 * The UI fee display must match what the program actually charges.
 *
 * It did not. `FEE_BPS = 5` was read as basis points and rendered as
 * `FEE_BPS / 100` = 0.05%, while lib.rs computes `distributable * 5 / 1000` =
 * 0.5%. The site understated its own fee by a factor of ten, in the direction
 * that flatters the project, which is the worst direction to be wrong in.
 *
 * This reads the divisor out of lib.rs so the two cannot drift apart again.
 *
 * Run: npm run check:fee
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, "..", "..", "programs", "deathclock", "src", "lib.rs");

import { FEE_NUMERATOR, FEE_DENOMINATOR, FEE_PERCENT } from "../src/utils/constants";

let failures = 0;
const check = (label, ok, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

// Parse the fee arithmetic out of the Rust source.
const source = readFileSync(LIB, "utf8");
const match = source.match(/checked_mul\((\d+)\)[\s\S]{0,80}?\/ (\d[\d_]*);/);

if (!match) {
  console.error("could not find the fee arithmetic in lib.rs; check the regex");
  process.exit(1);
}

const programNumerator = Number(match[1]);
const programDenominator = Number(match[2].replace(/_/g, ""));
const programPercent = (programNumerator / programDenominator) * 100;

console.log("program fee, parsed from lib.rs");
check(`numerator is ${programNumerator}`, programNumerator === FEE_NUMERATOR);
check(`divisor is ${programDenominator}`, programDenominator === FEE_DENOMINATOR);
check(
  `program charges ${programPercent}%`,
  Math.abs(programPercent - FEE_PERCENT) < 1e-9,
  `(UI shows ${FEE_PERCENT}%)`,
);

// The worked example in StateWalkthrough uses a 10 SOL estate, so the rendered
// fee line should equal 10 * 0.005.
const estate = 10;
check(
  `10 SOL estate -> ${(estate * FEE_PERCENT) / 100} SOL fee`,
  Math.abs((estate * FEE_PERCENT) / 100 - 0.05) < 1e-9,
);

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("The displayed fee matches what the program charges.");