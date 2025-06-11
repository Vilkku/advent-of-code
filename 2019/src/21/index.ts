import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { printAnswer } from "../util/benchmark.ts";
import { type Program, runProgram } from "./funcs.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer(
  "Part 1",
  () => {
    // Jump if one of these is true:
    // - C is hole and D is ground
    // - A is hole
    const program: Program = [
      "OR D J",
      "NOT C T",
      "AND T J",
      "NOT A T",
      "OR T J",
    ];
    const output = runProgram(initialMemory, program);

    if (output[output.length - 1] > 65535) {
      return output[output.length - 1];
    }

    console.log(String.fromCharCode(...output));
    throw new Error("Did not make it across");
  },
  19359533,
);
