import {
  getRequiredOre,
  maxFuelForOre,
  parseReactions,
  type Reaction,
} from "./funcs.ts";

import { getInput } from "../util/input.ts";

const reactions: Reaction[] = parseReactions(
  await getInput(import.meta.dir, "input.txt"),
);

console.log("Part 1", getRequiredOre(reactions));

console.log("Part 2", maxFuelForOre(reactions));
