import { getInput, inputToRows, toInt } from "../util/input.ts";
import { calculateFuelForMass, calculateFuelForMassAndFuel } from "./funcs.ts";

const masses = inputToRows(await getInput(import.meta.dir, "input.txt")).map(
  toInt,
);

const totalFuelRequired = masses
  .map(calculateFuelForMass)
  .reduce((prev, cur) => prev + cur, 0);

console.log("Part 1", totalFuelRequired);

const totalFuelRequiredWithFuelForFuel = masses
  .map(calculateFuelForMassAndFuel)
  .reduce((prev, cur) => prev + cur, 0);

console.log("Part 2", totalFuelRequiredWithFuelForFuel);
