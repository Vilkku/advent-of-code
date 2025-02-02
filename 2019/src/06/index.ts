import { benchmark } from "../util/benchmark";
import { getInput, inputToRows } from "../util/input";
import { getOrbitCount, getOrbitTree, getStepsFromAtoB } from "./funcs";

const orbitMap: [string, string][] = inputToRows(
  await getInput(import.meta.dir, "input.txt"),
).map((row) => row.split(")") as [string, string]);

benchmark(() => {
  const orbitTree = getOrbitTree(orbitMap);

  console.log("Part 1", getOrbitCount(orbitTree, "COM"));
  console.log("Part 2", getStepsFromAtoB(orbitTree, "YOU", "SAN"));
});
