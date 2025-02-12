import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { benchmark } from "../util/benchmark.ts";
import { getMaxThrusterSignal } from "./funcs.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

benchmark(() => {
  console.log("Part 1", getMaxThrusterSignal(initialMemory, 0, 4));
}, "Part 1");

benchmark(() => {
  console.log("Part 2", getMaxThrusterSignal(initialMemory, 5, 9));
}, "Part 2");
