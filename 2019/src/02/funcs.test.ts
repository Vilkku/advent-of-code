import { expect, test } from "bun:test";
import { getInstructionResult, parseOpcode, run } from "./funcs.ts";

const addOpcode = parseOpcode(1);
const multiplyOpcode = parseOpcode(2);

test("execute", () => {
  expect(
    getInstructionResult(
      { opcode: addOpcode, parameters: [9, 10, 3] },
      [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 3, value: 70 });

  expect(
    getInstructionResult(
      { opcode: multiplyOpcode, parameters: [3, 11, 0] },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 0, value: 3500 });

  expect(
    getInstructionResult(
      { opcode: multiplyOpcode, parameters: [3, 11, 0] },
      [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
    ),
  ).toMatchObject({ address: 0, value: 3500 });
});

test("run", () => {
  expect(run([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toMatchObject([
    3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50,
  ]);

  expect(run([1, 0, 0, 0, 99])).toMatchObject([2, 0, 0, 0, 99]);
  expect(run([2, 3, 0, 3, 99])).toMatchObject([2, 3, 0, 6, 99]);
  expect(run([2, 4, 4, 5, 99, 0])).toMatchObject([2, 4, 4, 5, 99, 9801]);
  expect(run([1, 1, 1, 4, 99, 5, 6, 0, 99])).toMatchObject([
    30, 1, 1, 4, 2, 5, 6, 0, 99,
  ]);
});
