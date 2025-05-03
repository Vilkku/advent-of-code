import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import {
  asciiToPixel,
  generateImageData,
  getSumOfAlignmentParameters,
} from "./funcs.ts";
import { printImageData } from "../util/map.ts";
import { printAnswer } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer(
  "Part 1",
  () => {
    const imageData = generateImageData(initialMemory);
    printImageData(imageData, asciiToPixel);
    return getSumOfAlignmentParameters(imageData);
  },
  2660,
);
