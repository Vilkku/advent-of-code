import { getInput, inputToRows } from "../util/input";
import {
  executeCompleteVaporizationByGiantLaser,
  getSuitableLocationForBase,
} from "./funcs.ts";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";

const map = inputToRows(await getInput(import.meta.dir, "input.txt")).map((s) =>
  s.split(""),
);

const benchmark = useBenchmark();

benchmark.reset();
const suitableLocationForBase = getSuitableLocationForBase(map);
const part1Answer = suitableLocationForBase.asteroidsInLineOfSight;
console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(340);

benchmark.reset();
const vaporizedAsteroids = executeCompleteVaporizationByGiantLaser(
  suitableLocationForBase.coordinate,
  map,
);
const part2Answer =
  vaporizedAsteroids[199][0] * 100 + vaporizedAsteroids[199][1];
console.log("Part 2", part2Answer);
benchmark.get();
expect(part2Answer).toBe(2628);
