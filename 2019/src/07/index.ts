import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { getMaxThrusterSignal } from "./funcs.ts";
import { expect } from "bun:test";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const part1Answer = getMaxThrusterSignal(initialMemory, 0, 4);
console.log("Part 1", part1Answer);
expect(part1Answer).toBe(87138);

const part2Answer = getMaxThrusterSignal(initialMemory, 5, 9);
console.log("Part 2", part2Answer);
expect(part2Answer).toBe(17279674);
