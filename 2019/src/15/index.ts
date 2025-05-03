import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { printAnswer } from "../util/benchmark.ts";
import { explore, spreadOxygenToAllFloors, tiles } from "./funcs.ts";
import { printMap, type Map } from "../util/map.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const map: Map = { 0: { 0: tiles.floor } };

printAnswer("Part 1", () => explore(0, 0, initialMemory, map), 216);
printMap(map);

printAnswer("Part 2", () => spreadOxygenToAllFloors(map), 326);
