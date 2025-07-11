import { expect, test } from "bun:test";
import {
  calculateBiodiversityRating,
  getNextRepeatingState,
  getNextState,
  parseGrid,
  serializeGrid,
} from "./funcs.ts";

test("calculateBiodiversityRating", () => {
  const state = `.....
.....
.....
#....
.#...`;

  expect(calculateBiodiversityRating(parseGrid(state))).toBe(2129920);
});

test("getNextState", () => {
  const initialState = parseGrid(`....#
#..#.
#..##
..#..
#....`);

  const state1 = parseGrid(`#..#.
####.
###.#
##.##
.##..`);

  const state2 = parseGrid(`#####
....#
....#
...#.
#.###`);

  const state3 = parseGrid(`#....
####.
...##
#.##.
.##.#`);

  const state4 = parseGrid(`####.
....#
##..#
.....
##...`);

  expect(serializeGrid(getNextState(initialState))).toBe(serializeGrid(state1));
  expect(serializeGrid(getNextState(state1))).toBe(serializeGrid(state2));
  expect(serializeGrid(getNextState(state2))).toBe(serializeGrid(state3));
  expect(serializeGrid(getNextState(state3))).toBe(serializeGrid(state4));
});

test("getNextRepeatingState", () => {
  const initialState = parseGrid(`....#
#..#.
#..##
..#..
#....`);

  const firstRepeatingState = parseGrid(`.....
.....
.....
#....
.#...`);

  expect(serializeGrid(getNextRepeatingState(initialState))).toBe(
    serializeGrid(firstRepeatingState),
  );
});
