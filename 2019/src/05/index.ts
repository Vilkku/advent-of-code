import { getInput, inputToNumbers } from "../util/input.ts";
import { run } from "../intcode/run.ts";

const initialMemory = inputToNumbers(
  await getInput(import.meta.dir, "input.txt"),
);

const diagCodes: number[] = [];

run(initialMemory, {
  input: () => 1,
  output: (value: number) => diagCodes.push(value),
});

console.log("Part 1", diagCodes[diagCodes.length - 1]);
