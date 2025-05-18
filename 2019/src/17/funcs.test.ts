import { expect, test } from "bun:test";
import { instructionToAsciiInstruction } from "./funcs.ts";

test("instructionToAsciiInstruction", () => {
  expect(instructionToAsciiInstruction(["L", "10"])).toEqual([76, 44, 49, 48]);
});
