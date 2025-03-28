import { expect, test } from "bun:test";
import {
  type MoonMap,
  simulateNSteps,
  calculateEnergy,
  getStepsRequiredForDuplicateState,
  simulateStep,
} from "./funcs.ts";

const exampleMap: MoonMap = [
  // <x=-1, y=0, z=2>
  { position: { x: -1, y: 0, z: 2 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=2, y=-10, z=-7>
  { position: { x: 2, y: -10, z: -7 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=4, y=-8, z=8>
  { position: { x: 4, y: -8, z: 8 }, velocity: { x: 0, y: 0, z: 0 } },
  // <x=3, y=5, z=-1>
  { position: { x: 3, y: 5, z: -1 }, velocity: { x: 0, y: 0, z: 0 } },
];

const exampleMapAfter1Step = [
  { position: { x: 2, y: -1, z: 1 }, velocity: { x: 3, y: -1, z: -1 } },
  { position: { x: 3, y: -7, z: -4 }, velocity: { x: 1, y: 3, z: 3 } },
  { position: { x: 1, y: -7, z: 5 }, velocity: { x: -3, y: 1, z: -3 } },
  { position: { x: 2, y: 2, z: 0 }, velocity: { x: -1, y: -3, z: 1 } },
];

const exampleMapAfter2Steps = [
  { position: { x: 5, y: -3, z: -1 }, velocity: { x: 3, y: -2, z: -2 } },
  { position: { x: 1, y: -2, z: 2 }, velocity: { x: -2, y: 5, z: 6 } },
  { position: { x: 1, y: -4, z: -1 }, velocity: { x: 0, y: 3, z: -6 } },
  { position: { x: 1, y: -4, z: 2 }, velocity: { x: -1, y: -6, z: 2 } },
];

const exampleMapAfter10Steps = [
  { position: { x: 2, y: 1, z: -3 }, velocity: { x: -3, y: -2, z: 1 } },
  { position: { x: 1, y: -8, z: 0 }, velocity: { x: -1, y: 1, z: 3 } },
  { position: { x: 3, y: -6, z: 1 }, velocity: { x: 3, y: 2, z: -3 } },
  { position: { x: 2, y: 0, z: 4 }, velocity: { x: 1, y: -1, z: -1 } },
];

test("simulateStep", () => {
  expect(simulateStep(exampleMap)).toMatchObject(exampleMapAfter1Step);

  expect(simulateStep(exampleMapAfter1Step)).toMatchObject(
    exampleMapAfter2Steps,
  );
});

test("simulateNSteps", () => {
  expect(simulateNSteps(exampleMap, 2)).toMatchObject(exampleMapAfter2Steps);
  expect(simulateNSteps(exampleMap, 10)).toMatchObject(exampleMapAfter10Steps);
});

test("calculateEnergy", () => {
  expect(calculateEnergy(exampleMapAfter10Steps)).toBe(179);
});

test("getStepsRequiredForDuplicateState", () => {
  expect(getStepsRequiredForDuplicateState(exampleMap)).toBe(2772);

  const secondExampleMap: MoonMap = [
    // <x=-8, y=-10, z=0>
    { position: { x: -8, y: -10, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
    // <x=5, y=5, z=10>
    { position: { x: 5, y: 5, z: 10 }, velocity: { x: 0, y: 0, z: 0 } },
    // <x=2, y=-7, z=3>
    { position: { x: 2, y: -7, z: 3 }, velocity: { x: 0, y: 0, z: 0 } },
    // <x=9, y=-8, z=-3>
    { position: { x: 9, y: -8, z: -3 }, velocity: { x: 0, y: 0, z: 0 } },
  ];

  expect(getStepsRequiredForDuplicateState(secondExampleMap)).toBe(4686774924);
});
