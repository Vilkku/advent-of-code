import {
  getInput,
  inputToIntcodeComputerMemory,
  toInt,
} from "../util/input.ts";
import { getSmallestAndLargestKeysInRecord, paintSquares } from "./funcs.ts";
import { styleText } from "node:util";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.reset();
const mapStartingOnBlack = paintSquares(initialMemory, 0);
const part1Answer = Object.values(mapStartingOnBlack).reduce((prev, curr) => {
  return prev + Object.values(curr).length;
}, 0);

console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(2226);

benchmark.reset();
const mapStartingOnWhite = paintSquares(initialMemory, 1);

const { min: smallestY, max: largestY } =
  getSmallestAndLargestKeysInRecord(mapStartingOnWhite);

let smallestX = 0;
let largestX = 0;

Object.values(mapStartingOnWhite).forEach((row) => {
  const { min, max } = getSmallestAndLargestKeysInRecord(row);

  if (min < smallestX) {
    smallestX = min;
  }

  if (max > largestX) {
    largestX = max;
  }
});

const width = largestX + 1 - smallestX;
const pxStr = "██";
const printedWidth = width * pxStr.length;

console.log(
  `+${" Part 2 ".padStart(printedWidth / 2 + 4, "-").padEnd(printedWidth, "-")}+`,
);
for (let y = smallestY; y <= largestY; y++) {
  const row = [];

  for (let x = smallestX; x <= largestX; x++) {
    const px = mapStartingOnWhite[y]?.[x] ?? 0;

    switch (px) {
      case 0:
        row.push(styleText("black", pxStr));
        break;
      case 1:
        row.push(styleText("white", pxStr));
        break;
    }
  }

  console.log(`|${row.join("")}|`);
}
console.log(`+${"-".repeat(printedWidth)}+`);
benchmark.get();
