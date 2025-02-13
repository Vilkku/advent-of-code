import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { useBenchmark } from "../util/benchmark.ts";
import { getMaxThrusterSignal } from "./funcs.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.start("Part 1");
console.log("Part 1", getMaxThrusterSignal(initialMemory, 0, 4));
benchmark.print("Part 1");

benchmark.start("Part 2");
console.log("Part 2", getMaxThrusterSignal(initialMemory, 5, 9));
benchmark.print("Part 2");

benchmark.printGlobal();
