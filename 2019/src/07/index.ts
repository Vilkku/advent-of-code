import { getInput, inputToNumbers } from "../util/input.ts";
import { benchmark } from "../util/benchmark.ts";
import { getMaxThrusterSignal } from "./funcs.ts";

const initialMemory = inputToNumbers(
  await getInput(import.meta.dir, "input.txt"),
);

benchmark(() => {
  console.log("Part 1", getMaxThrusterSignal(initialMemory, 0, 4));
}, "Part 1");
