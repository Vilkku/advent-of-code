import { expect, test } from "bun:test";
import { getInstructionResult, parseInstruction } from "./instruction.ts";

test("parseInstruction", () => {
  const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];

  expect(parseInstruction(0, program)).toMatchObject({
    type: "add",
    parameters: [9, 10, 3],
  });

  expect(parseInstruction(4, program)).toMatchObject({
    type: "multiply",
    parameters: [3, 11, 0],
  });

  expect(() => parseInstruction(2, program)).toThrow();
  expect(() => parseInstruction(0, [1, 9, 10])).toThrow();
});

test("getInstructionResult", () => {
  expect(
    getInstructionResult(
      { type: "add", parameters: [9, 10, 3] },
      [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 3, value: 70 });

  expect(
    getInstructionResult(
      { type: "multiply", parameters: [3, 11, 0] },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 0, value: 3500 });

  expect(
    getInstructionResult(
      { type: "multiply", parameters: [3, 11, 0] },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 0, value: 3500 });
});
