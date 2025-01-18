import { getInput, inputToRows } from "../util/input.ts";
import {
  findIntersections,
  getClosestDistance,
  getFewestSteps,
  inputRowToInstructions,
  instructionsToPath,
} from "./funcs.ts";

const paths = inputToRows(await getInput(import.meta.dir, "input.txt"))
  .map(inputRowToInstructions)
  .map(instructionsToPath);

const intersections = findIntersections(paths[0], paths[1]);

console.log("Part 1", getClosestDistance(intersections));

console.log("Part 1", getFewestSteps(intersections));
