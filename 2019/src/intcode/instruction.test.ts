import { expect, test } from "bun:test";
import { getInstructionResult, parseInstruction } from "./instruction.ts";

import type { Parameter } from "./types.ts";

const createPositionParameter = (value: number): Parameter => ({
  value,
  mode: "position",
});

const createImmediateParameter = (value: number): Parameter => ({
  value,
  mode: "immediate",
});

test("parseInstruction", () => {
  const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];

  expect(parseInstruction(0, program)).toMatchObject({
    type: "add",
    parameters: [
      { mode: "position", value: 9 },
      { mode: "position", value: 10 },
      { mode: "position", value: 3 },
    ],
  });

  expect(parseInstruction(4, program)).toMatchObject({
    type: "multiply",
    parameters: [
      { mode: "position", value: 3 },
      { mode: "position", value: 11 },
      { mode: "position", value: 0 },
    ],
  });

  expect(() => parseInstruction(2, program)).toThrow();
  expect(() => parseInstruction(0, [1, 9, 10])).toThrow();
});

test("getInstructionResult", () => {
  expect(
    getInstructionResult(
      {
        type: "add",
        parameters: [
          createPositionParameter(9),
          createPositionParameter(10),
          createPositionParameter(3),
        ],
      },
      [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
      0,
    ),
  ).toMatchObject({ address: 3, value: 70 });

  expect(
    getInstructionResult(
      {
        type: "multiply",
        parameters: [
          createPositionParameter(3),
          createPositionParameter(11),
          createPositionParameter(0),
        ],
      },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
      0,
    ),
  ).toMatchObject({ address: 0, value: 3500 });

  expect(
    getInstructionResult(
      {
        type: "multiply",
        parameters: [
          createPositionParameter(3),
          createPositionParameter(11),
          createPositionParameter(0),
        ],
      },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
      0,
    ),
  ).toMatchObject({ address: 0, value: 3500 });

  expect(
    getInstructionResult(
      {
        type: "multiply",
        parameters: [
          createPositionParameter(4),
          createImmediateParameter(3),
          createPositionParameter(4),
        ],
      },
      [1002, 4, 3, 4, 33],
      0,
    ),
  ).toMatchObject({ address: 4, value: 99 });
});
