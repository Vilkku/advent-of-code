import { printAnswer } from "../util/benchmark.ts";
import { createIntcodeComputers } from "./funcs.ts";
import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer("Part 1", () => createIntcodeComputers(initialMemory), 26744);
