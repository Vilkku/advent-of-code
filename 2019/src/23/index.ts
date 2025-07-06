import { printAnswer } from "../util/benchmark.ts";
import {
  createIntcodeComputers,
  createIntcodeComputersWithNAT,
} from "./funcs.ts";
import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer("Part 1", () => createIntcodeComputers(initialMemory), 26744);
printAnswer(
  "Part 2",
  () => createIntcodeComputersWithNAT(initialMemory),
  19498,
);
