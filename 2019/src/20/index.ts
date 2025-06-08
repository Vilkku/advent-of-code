import { printAnswer } from "../util/benchmark.ts";
import { parsePlutoMap } from "./funcs.ts";
import { getInput } from "../util/input.ts";
import { bfs } from "../util/bfs.ts";

const input = await getInput(import.meta.dir, "input.txt");

printAnswer(
  "Part 1",
  () => {
    const plutoMap = parsePlutoMap(input);
    const distances = bfs(plutoMap.graph, plutoMap.start);
    return distances[plutoMap.end];
  },
  632,
);
