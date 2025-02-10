import { getInput, inputToNumbers } from "../util/input.ts";
import { run, runUntilCompletion } from "../intcode/run.ts";
import { benchmark } from "../util/benchmark.ts";

const initialMemory = inputToNumbers(
  await getInput(import.meta.dir, "input.txt"),
);

benchmark(() => {
  const { output: part1DiagCodes } = runUntilCompletion(initialMemory, 1);
  console.log("Part 1", part1DiagCodes[part1DiagCodes.length - 1]);
}, "Part 1");

benchmark(() => {
  const { output: part2DiagCodes } = runUntilCompletion(initialMemory, 5);
  console.log("Part 2", part2DiagCodes[0]);
}, "Part 2");
