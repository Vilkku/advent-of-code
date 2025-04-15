import { expect, test } from "bun:test";
import { generateNextPhase, generateNPhases } from "./funcs.ts";

const phase1 = [1, 2, 3, 4, 5, 6, 7, 8];
const phase2 = [4, 8, 2, 2, 6, 1, 5, 8];
const phase3 = [3, 4, 0, 4, 0, 4, 3, 8];
const phase4 = [0, 3, 4, 1, 5, 5, 1, 8];
const phase5 = [0, 1, 0, 2, 9, 4, 9, 8];

test("generateNextPhase", () => {
  expect(generateNextPhase(phase1)).toEqual(phase2);
  expect(generateNextPhase(phase2)).toEqual(phase3);
  expect(generateNextPhase(phase3)).toEqual(phase4);
  expect(generateNextPhase(phase4)).toEqual(phase5);
});

test("generateNPhases", () => {
  expect(generateNPhases(phase1, 4)).toEqual(phase5);
  expect(
    generateNPhases(
      [
        8, 0, 8, 7, 1, 2, 2, 4, 5, 8, 5, 9, 1, 4, 5, 4, 6, 6, 1, 9, 0, 8, 3, 2,
        1, 8, 6, 4, 5, 5, 9, 5,
      ],
      100,
    ).slice(0, 8),
  ).toEqual([2, 4, 1, 7, 6, 1, 7, 6]);
  expect(
    generateNPhases(
      [
        1, 9, 6, 1, 7, 8, 0, 4, 2, 0, 7, 2, 0, 2, 2, 0, 9, 1, 4, 4, 9, 1, 6, 0,
        4, 4, 1, 8, 9, 9, 1, 7,
      ],
      100,
    ).slice(0, 8),
  ).toEqual([7, 3, 7, 4, 5, 4, 1, 8]);
  expect(
    generateNPhases(
      [
        6, 9, 3, 1, 7, 1, 6, 3, 4, 9, 2, 9, 4, 8, 6, 0, 6, 3, 3, 5, 9, 9, 5, 9,
        2, 4, 3, 1, 9, 8, 7, 3,
      ],
      100,
    ).slice(0, 8),
  ).toEqual([5, 2, 4, 3, 2, 1, 3, 3]);
});
