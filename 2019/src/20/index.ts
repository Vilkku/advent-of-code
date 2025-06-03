import { printAnswer } from "../util/benchmark.ts";
import { parsePlutoMap } from "./funcs.ts";
import { getInput } from "../util/input.ts";
import { dijkstra } from "../util/dijkstra.ts";

const input = await getInput(import.meta.dir, "input.txt");

printAnswer("Part 1", () => {
  const plutoMap = parsePlutoMap(input);
  const distances = dijkstra(plutoMap.graph, plutoMap.start);
  return distances[plutoMap.end];
});
