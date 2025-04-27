import { useBenchmark } from "../util/benchmark.ts";
import { getInput, toInt } from "../util/input.ts";
import { generateNPhases, getMessageWithOffset } from "./funcs.ts";

const input = (await getInput(import.meta.dir, "input.txt"))
  .split("")
  .map(toInt);

const benchmark = useBenchmark();
benchmark.reset();

const part1Answer = generateNPhases(input, 100).slice(0, 8).join("");

console.log("Part 1", part1Answer);
benchmark.get();

benchmark.reset();
const part2Answer = getMessageWithOffset(input, 100).join("");
console.log("Part 2", part2Answer);
benchmark.get();
