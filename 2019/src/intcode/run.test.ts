import { describe, expect, test } from "bun:test";
import { run } from "./run.ts";

describe("run", () => {
  test("day 2", () => {
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

  test("day 5", () => {
    expect(run([1002, 4, 3, 4, 33])).toMatchObject([1002, 4, 3, 4, 99]);
  });
});
