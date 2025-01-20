import { expect, test } from "bun:test";
import { isPasswordValid } from "./funcs.ts";

test("isPasswordValid", () => {
  expect(isPasswordValid(111111)).toBeTrue();
  expect(isPasswordValid(223450)).toBeFalse();
  expect(isPasswordValid(123789)).toBeFalse();

  expect(
    isPasswordValid(112233, { exactlyTwoAdjacentDigits: true }),
  ).toBeTrue();
  expect(
    isPasswordValid(123444, { exactlyTwoAdjacentDigits: true }),
  ).toBeFalse();
  expect(
    isPasswordValid(111122, { exactlyTwoAdjacentDigits: true }),
  ).toBeTrue();
});
