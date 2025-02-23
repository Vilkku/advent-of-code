import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { runUntilCompletion } from "../intcode/runUntilCompletion.ts";
import { expect } from "bun:test";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const { output: part1DiagCodes } = runUntilCompletion(initialMemory, 1);
const part1Answer = part1DiagCodes[part1DiagCodes.length - 1];
console.log("Part 1", part1Answer);
expect(part1Answer).toBe(15259545);

const { output: part2DiagCodes } = runUntilCompletion(initialMemory, 5);
const part2Answer = part2DiagCodes[0];
console.log("Part 2", part2Answer);
expect(part2Answer).toBe(7616021);
