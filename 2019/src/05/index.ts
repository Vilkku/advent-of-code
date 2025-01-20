import { getInput, inputToNumbers } from "../util/input.ts";
import { run } from "../intcode/run.ts";

const initialMemory = inputToNumbers(
  await getInput(import.meta.dir, "input.txt"),
);

const { output: part1DiagCodes } = run(initialMemory, 1);
console.log("Part 1", part1DiagCodes[part1DiagCodes.length - 1]);

const { output: part2DiagCodes } = run(initialMemory, 5);
console.log("Part 2", part2DiagCodes[0]);
