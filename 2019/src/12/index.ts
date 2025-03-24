import {
  calculateEnergy,
  getStepsRequiredForDuplicateState,
  type MoonMap,
  simulateNSteps,
} from "./funcs.ts";
import { useBenchmark } from "../util/benchmark.ts";
import { expect } from "bun:test";
import { getInput, inputToRows, toInt } from "../util/input.ts";

const map: MoonMap = inputToRows(
  await getInput(import.meta.dir, "input.txt"),
).map((row) => {
  const matches = row.match(/<x=(-?[0-9]+), y=(-?[0-9]+), z=(-?[0-9]+)>/);

  return {
    position: {
      x: toInt(matches![1]),
      y: toInt(matches![2]),
      z: toInt(matches![3]),
    },
    velocity: { x: 0, y: 0, z: 0 },
  };
});

const benchmark = useBenchmark();

benchmark.reset();
const mapAfter1000Steps = simulateNSteps(map, 1000);
const part1Answer = calculateEnergy(mapAfter1000Steps);

console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(11384);

benchmark.reset();
const part2Answer = getStepsRequiredForDuplicateState(map);

console.log("Part 2", part2Answer);
benchmark.get();
expect(part2Answer).toBe(452582583272768);
