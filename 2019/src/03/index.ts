import { benchmark_deprecated } from "../util/benchmark.ts";
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

benchmark_deprecated(() => {
  const intersections = benchmark_deprecated(
    () => findIntersections(paths[0], paths[1]),
    "findIntersections",
  );

  benchmark_deprecated(() => {
    console.log("Part 1", getClosestDistance(intersections));
  }, "getFewestSteps");

  benchmark_deprecated(() => {
    console.log("Part 1", getFewestSteps(intersections));
  }, "getFewestSteps");
});
