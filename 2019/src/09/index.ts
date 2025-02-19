import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { runUntilCompletion } from "../intcode/run.ts";
import { useBenchmark } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.start("Part 1");
const part1Result = runUntilCompletion(initialMemory, 1);

console.log("Part 1", part1Result.output[0]);
benchmark.print("Part 1");

benchmark.start("Part 2");
const part2Result = runUntilCompletion(initialMemory, 2);

console.log("Part 2", part2Result.output[0]);
benchmark.print("Part 2");
