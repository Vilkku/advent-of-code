import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);
