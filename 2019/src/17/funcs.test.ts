import { expect, test } from "bun:test";
import { instructionToAsciiInstruction } from "./funcs.ts";

test("instructionToAsciiInstruction", () => {
  expect(
    instructionToAsciiInstruction(["R", "8", "L", "6", "L", "10", "L", "10"]),
  ).toEqual([
    82, 44, 56, 44, 76, 44, 54, 44, 76, 44, 49, 48, 44, 76, 44, 49, 48,
  ]);
});
