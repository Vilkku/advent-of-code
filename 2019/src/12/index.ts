import {
  calculateEnergy,
  getStepsRequiredForDuplicateState,
  type MoonMap,
  simulateNSteps,
} from "./funcs.ts";
import { useBenchmark } from "../util/benchmark.ts";
import { expect } from "bun:test";

const map: MoonMap = [
  // <x=-7, y=-1, z=6>
  { position: { x: -7, y: -1, z: 6 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=6, y=-9, z=-9>
  { position: { x: 6, y: -9, z: -9 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=-12, y=2, z=-7>
  { position: { x: -12, y: 2, z: -7 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=4, y=-17, z=-12>
  { position: { x: 4, y: -17, z: -12 }, velocity: { x: 0, y: 0, z: 0 } },
];

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
