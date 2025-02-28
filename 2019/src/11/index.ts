import {
  getInput,
  inputToIntcodeComputerMemory,
  toInt,
} from "../util/input.ts";
import { getSmallestAndLargestKeysInRecord, paintSquares } from "./funcs.ts";
import { styleText } from "node:util";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";
import { print2DArray } from "../util/print2DArray.ts";

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

const image: number[][] = [];
for (let y = smallestY; y <= largestY; y++) {
  const row = [];

  for (let x = smallestX; x <= largestX; x++) {
    row.push(mapStartingOnWhite[y]?.[x] ?? 0);
  }

  image.push(row);
}

print2DArray(image, "Part 2");
benchmark.get();
