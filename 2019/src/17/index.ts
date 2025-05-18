import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import {
  asciiToPixel,
  findValidInstructionAndFunctionsToEnd,
  runVacuumRobot,
  getSumOfAlignmentParameters,
  instructionToAsciiInstructionWithNewline,
} from "./funcs.ts";
import { type ImageData, printImageData } from "../util/map.ts";
import { printAnswer } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

let imageData: ImageData;

printAnswer(
  "Part 1",
  () => {
    imageData = runVacuumRobot(initialMemory).imageData;
    printImageData(imageData, asciiToPixel);
    return getSumOfAlignmentParameters(imageData);
  },
  2660,
);

printAnswer(
  "Part 2",
  () => {
    const { instruction, a, b, c } =
      findValidInstructionAndFunctionsToEnd(imageData);

    const asciiMainRoutine =
      instructionToAsciiInstructionWithNewline(instruction);
    const asciiInstructionA = instructionToAsciiInstructionWithNewline(a);
    const asciiInstructionB = instructionToAsciiInstructionWithNewline(b);
    const asciiInstructionC = instructionToAsciiInstructionWithNewline(c);

    const part2InitialMemory = [...initialMemory];
    part2InitialMemory[0] = 2;

    const { dust } = runVacuumRobot(part2InitialMemory, [
      asciiMainRoutine,
      asciiInstructionA,
      asciiInstructionB,
      asciiInstructionC,
    ]);

    return dust;
  },
  790595,
);
