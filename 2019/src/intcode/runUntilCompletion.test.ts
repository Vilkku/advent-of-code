import { describe, expect, test } from "bun:test";
import { runUntilCompletion } from "./runUntilCompletion.ts";

describe("runUntilCompletion", () => {
  test("day 2", () => {
    expect(
      runUntilCompletion([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]).memory,
    ).toMatchObject([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    expect(runUntilCompletion([1, 0, 0, 0, 99]).memory).toMatchObject([
      2, 0, 0, 0, 99,
    ]);
    expect(runUntilCompletion([2, 3, 0, 3, 99]).memory).toMatchObject([
      2, 3, 0, 6, 99,
    ]);
    expect(runUntilCompletion([2, 4, 4, 5, 99, 0]).memory).toMatchObject([
      2, 4, 4, 5, 99, 9801,
    ]);
    expect(
      runUntilCompletion([1, 1, 1, 4, 99, 5, 6, 0, 99]).memory,
    ).toMatchObject([30, 1, 1, 4, 2, 5, 6, 0, 99]);
  });

  test("day 5", () => {
    expect(runUntilCompletion([1002, 4, 3, 4, 33]).memory).toMatchObject([
      1002, 4, 3, 4, 99,
    ]);

    const inputIsEqualTo8Pos = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
    expect(runUntilCompletion(inputIsEqualTo8Pos, 8).output[0]).toBe(1);
    expect(runUntilCompletion(inputIsEqualTo8Pos, 2).output[0]).toBe(0);

    const inputIsLessThan8Pos = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
    expect(runUntilCompletion(inputIsLessThan8Pos, 2).output[0]).toBe(1);
    expect(runUntilCompletion(inputIsLessThan8Pos, 8).output[0]).toBe(0);

    const inputIsEqualTo8Immediate = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
    expect(runUntilCompletion(inputIsEqualTo8Immediate, 8).output[0]).toBe(1);
    expect(runUntilCompletion(inputIsEqualTo8Immediate, 2).output[0]).toBe(0);

    const inputIsNonZeroPos = [
      3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9,
    ];
    expect(runUntilCompletion(inputIsNonZeroPos, 0).output[0]).toBe(0);
    expect(runUntilCompletion(inputIsNonZeroPos, 8).output[0]).toBe(1);

    const inputIsNonZeroImmediate = [
      3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1,
    ];
    expect(runUntilCompletion(inputIsNonZeroImmediate, 0).output[0]).toBe(0);
    expect(runUntilCompletion(inputIsNonZeroImmediate, 8).output[0]).toBe(1);

    const inputRelationTo8 = [
      3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106,
      0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1,
      46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99,
    ];
    expect(runUntilCompletion(inputRelationTo8, 6).output[0]).toBe(999);
    expect(runUntilCompletion(inputRelationTo8, 8).output[0]).toBe(1000);
    expect(runUntilCompletion(inputRelationTo8, 10).output[0]).toBe(1001);
  });

  test("day 9", () => {
    expect(
      runUntilCompletion([
        109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0,
        99,
      ]).output,
    ).toMatchObject([
      109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99,
    ]);

    expect(
      runUntilCompletion([
        1102, 34915192, 34915192, 7, 4, 7, 99, 0,
      ]).output[0].toString(),
    ).toHaveLength(16);

    expect(runUntilCompletion([104, 1125899906842624, 99]).output[0]).toBe(
      1125899906842624,
    );
  });
});
