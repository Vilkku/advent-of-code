import { expect, test } from "bun:test";

import { calculateFuelForMass, calculateFuelForMassAndFuel } from "./funcs.ts";

test("calculateFuelForMass", () => {
  expect(calculateFuelForMass(12)).toBe(2);
  expect(calculateFuelForMass(14)).toBe(2);
  expect(calculateFuelForMass(1969)).toBe(654);
  expect(calculateFuelForMass(100756)).toBe(33583);
});

test("calculateFuelForMassAndFuel", () => {
  expect(calculateFuelForMassAndFuel(14)).toBe(2);
  expect(calculateFuelForMassAndFuel(1969)).toBe(966);
  expect(calculateFuelForMassAndFuel(100756)).toBe(50346);

  // Custom test input to detect accidentally returning negative number from calculateFuelForMassAndFuel()
  expect(calculateFuelForMassAndFuel(51173)).toBe(25556);
});
