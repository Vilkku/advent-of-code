import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { generateImage, getSumOfAlignmentParameters } from "./funcs.ts";
import { printImage } from "../util/map.ts";
import { printAnswer } from "../util/benchmark.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer(
  "Part 1",
  () => {
    const image = generateImage(initialMemory);
    printImage(image);
    return getSumOfAlignmentParameters(image);
  },
  2660,
);
