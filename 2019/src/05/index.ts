import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { run, runUntilCompletion } from "../intcode/run.ts";
import { benchmark_deprecated } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

benchmark_deprecated(() => {
  const { output: part1DiagCodes } = runUntilCompletion(initialMemory, 1);
  console.log("Part 1", part1DiagCodes[part1DiagCodes.length - 1]);
}, "Part 1");

benchmark_deprecated(() => {
  const { output: part2DiagCodes } = runUntilCompletion(initialMemory, 5);
  console.log("Part 2", part2DiagCodes[0]);
}, "Part 2");
