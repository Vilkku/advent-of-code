import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { expect } from "bun:test";
import { doAutopilot, run } from "./funcs.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const { pixels } = await run(initialMemory);

const part1Answer = pixels
  .flatMap((pxRow) => pxRow)
  .filter((px) => px === 2).length;

console.log("Part 1", part1Answer);
expect(part1Answer).toBe(312);

const part2InitialMemory = [...initialMemory];
part2InitialMemory[0] = 2;

const { score: part2Answer } = await run(part2InitialMemory, {
  onInput: (paddleX, ballX) =>
    new Promise((resolve) => resolve(doAutopilot(paddleX, ballX))),
});

console.log("Part 2", part2Answer);
expect(part2Answer).toBe(15909);
