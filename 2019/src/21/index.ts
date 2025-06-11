import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { printAnswer } from "../util/benchmark.ts";
import { type WalkProgram, runProgram, type RunProgram } from "./funcs.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer(
  "Part 1",
  () => {
    // Jump if one of these is true:
    // - C is hole and D is ground
    // - A is hole
    const program: WalkProgram = [
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

printAnswer(
  "Part 2",
  () => {
    // Jump if:
    // - A, B or C is hole and D is ground and E or H is ground
    const program: RunProgram = [
      "NOT A J",
      "NOT B T",
      "OR T J",
      "NOT C T",
      "OR T J",
      "AND D J",
      "NOT E T",
      "NOT T T",
      "OR H T",
      "AND T J",
    ];
    const output = runProgram(initialMemory, program, "RUN");

    if (output[output.length - 1] > 65535) {
      return output[output.length - 1];
    }

    console.log(String.fromCharCode(...output));
    throw new Error("Did not make it across");
  },
  1140310551,
);
