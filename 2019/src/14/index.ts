import {
  getRequiredOre,
  maxFuelForOre,
  parseReactions,
  type Reaction,
} from "./funcs.ts";
import { expect } from "bun:test";

import { getInput } from "../util/input.ts";
import { useBenchmark } from "../util/benchmark.ts";

const reactions: Reaction[] = parseReactions(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.reset();
const part1Answer = getRequiredOre(reactions);
console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(870051);

benchmark.reset();
const part2Answer = maxFuelForOre(reactions);
console.log("Part 2", part2Answer);
expect(part2Answer).toBe(1863741);
benchmark.get();
