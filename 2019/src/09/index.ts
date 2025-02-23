import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { useBenchmark } from "../util/benchmark.ts";
import { expect } from "bun:test";
import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.reset();
const part1Answer = IntcodeComputer.createAndRun(initialMemory, 1).outputs[0];
console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(2204990589);

benchmark.reset();
const part2Answer = IntcodeComputer.createAndRun(initialMemory, 2).outputs[0];
console.log("Part 2", part2Answer);
benchmark.get();
expect(part2Answer).toBe(50008);
