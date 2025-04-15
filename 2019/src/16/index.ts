import { getInput, toInt } from "../util/input.ts";
import { generateNextPhase, generateNPhases } from "./funcs.ts";

const input = (await getInput(import.meta.dir, "input.txt"))
  .split("")
  .map(toInt);

const part1Answer = generateNPhases(input, 100).slice(0, 8).join("");

console.log("Part 1", part1Answer);
