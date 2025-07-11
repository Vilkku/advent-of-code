import { expect, test } from "bun:test";
import { doCutInstruction, doDealInstruction } from "./funcs.ts";

test("doDealInstruction", () => {
  expect(
    doDealInstruction([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], {
      type: "deal",
      increment: 3,
    }),
  ).toEqual([0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
});

test("doCutInstruction", () => {
  expect(
    doCutInstruction([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { type: "cut", cut: 3 }),
  ).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);

  expect(
    doCutInstruction([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { type: "cut", cut: -4 }),
  ).toEqual([6, 7, 8, 9, 0, 1, 2, 3, 4, 5]);
});
