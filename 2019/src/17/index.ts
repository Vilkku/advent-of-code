import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import {
  asciiToPixel,
  findPathToEnd,
  generateImageData,
  getSumOfAlignmentParameters,
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
    imageData = generateImageData(initialMemory);
    printImageData(imageData, asciiToPixel);
    return getSumOfAlignmentParameters(imageData);
  },
  2660,
);

const testImageData = [
  [35, 35, 35, 35, 35, 35, 35, 46, 46, 46, 35, 35, 35, 35, 35],
  [35, 46, 46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 35],
  [35, 46, 46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 35],
  [46, 46, 46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 35],
  [46, 46, 46, 46, 46, 46, 35, 46, 46, 46, 35, 35, 35, 46, 35],
  [46, 46, 46, 46, 46, 46, 35, 46, 46, 46, 46, 46, 35, 46, 35],
  [94, 35, 35, 35, 35, 35, 35, 35, 35, 46, 46, 46, 35, 46, 35],
  [46, 46, 46, 46, 46, 46, 35, 46, 35, 46, 46, 46, 35, 46, 35],
  [46, 46, 46, 46, 46, 46, 35, 35, 35, 35, 35, 35, 35, 35, 35],
  [46, 46, 46, 46, 46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46],
  [46, 46, 46, 46, 35, 35, 35, 35, 35, 35, 35, 35, 35, 46, 46],
  [46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 46, 46, 46],
  [46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 46, 46, 46],
  [46, 46, 46, 46, 35, 46, 46, 46, 35, 46, 46, 46, 46, 46, 46],
  [46, 46, 46, 46, 35, 35, 35, 35, 35, 46, 46, 46, 46, 46, 46],
];

printImageData(testImageData, asciiToPixel);

printAnswer("Part 2", () => {
  findPathToEnd(testImageData);
  const part2InitialMemory = [...initialMemory];
  part2InitialMemory[0] = 2;

  return 0;
});
