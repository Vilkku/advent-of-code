import { getInput } from "../util/input.ts";
import { printAnswer } from "../util/benchmark.ts";
import {
  calculateBiodiversityRating,
  getBugsAfterNIterations,
  getNextRepeatingState,
  parseGrid,
} from "./funcs.ts";

const input = await getInput(import.meta.dir, "input.txt");

printAnswer(
  "Part 1",
  () => {
    const initialState = parseGrid(input);
    const firstRepeatingState = getNextRepeatingState(initialState);

    return calculateBiodiversityRating(firstRepeatingState);
  },
  18859569,
);

printAnswer("Part 2", () => {
  const initialState = parseGrid(input);
  return getBugsAfterNIterations(initialState, 200);
});
