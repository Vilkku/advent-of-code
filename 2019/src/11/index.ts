import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { paintSquares } from "./funcs.ts";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";
import { printMap } from "../util/map.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const benchmark = useBenchmark();

benchmark.reset();
const mapStartingOnBlack = paintSquares(initialMemory, 0);
const part1Answer = Object.values(mapStartingOnBlack).reduce((prev, curr) => {
  return prev + Object.values(curr).length;
}, 0);

console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(2226);

benchmark.reset();
const mapStartingOnWhite = paintSquares(initialMemory, 1);
printMap(mapStartingOnWhite);
benchmark.get();
