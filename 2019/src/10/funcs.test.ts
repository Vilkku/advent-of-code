import { expect, test } from "bun:test";
import { inputToRows } from "../util/input";
import { getAsteroidsInLineOfSight } from "./funcs";

const exampleMap = inputToRows(`.#..#
.....
#####
....#
...##`).map((s) => s.split(""));

test("getAsteroidsInLineOfSight", () => {
  expect(getAsteroidsInLineOfSight(1, 0, exampleMap)).toBe(7);
});
