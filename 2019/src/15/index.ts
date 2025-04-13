import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";
import { explore, type Map, spreadOxygenToAllFloors } from "./funcs.ts";
import {
  getSmallestAndLargestKeysInRecord,
  print2DArray,
} from "../util/print2DArray.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);
const benchmark = useBenchmark();

benchmark.reset();
const map: Map = { 0: { 0: 1 } };
const part1Answer = explore(0, 0, initialMemory, map);

const { min: smallestY, max: largestY } =
  getSmallestAndLargestKeysInRecord(map);

let smallestX = 0;
let largestX = 0;

Object.values(map).forEach((row) => {
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
    row.push(map[y]?.[x]);
  }

  image.push(row);
}

print2DArray(
  image,
  "Map",
  (px) => {
    switch (px) {
      case 0:
        return "#";
      case 1:
        return ".";
      case 2:
        return "O";
      default:
        return " ";
    }
  },
  " ",
);

console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(216);

benchmark.reset();
const part2Answer = spreadOxygenToAllFloors(map);
console.log("Part 2", part2Answer);
benchmark.get();
expect(part2Answer).toBe(326);
