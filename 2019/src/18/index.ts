import { printAnswer } from "../util/benchmark.ts";
import { getInput } from "../util/input.ts";
import { fewestSteps, parseVault } from "./funcs.ts";

const input = await getInput(import.meta.dir, "input.txt");
const { vault, startPosition } = parseVault(input);

printAnswer(
  "Part 1",
  () => {
    return fewestSteps(vault, startPosition, new Set<string>());
  },
  4250,
);
