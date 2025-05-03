import { printAnswer } from "../util/benchmark.ts";
import { getInput, toInt } from "../util/input.ts";
import { generateNPhases, getMessageWithOffset } from "./funcs.ts";

const input = (await getInput(import.meta.dir, "input.txt"))
  .split("")
  .map(toInt);

printAnswer(
  "Part 1",
  () => toInt(generateNPhases(input, 100).slice(0, 8).join("")),
  44098263,
);

printAnswer(
  "Part 2",
  () => toInt(getMessageWithOffset(input, 100).join("")),
  12482168,
);
