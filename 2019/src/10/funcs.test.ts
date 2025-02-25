import { describe, expect, test } from "bun:test";
import { inputToRows } from "../util/input";
import {
  executeCompleteVaporizationByGiantLaser,
  getAsteroidsInLineOfSight,
  getSuitableLocationForBase,
} from "./funcs";

const part1Map = inputToRows(`.#..#
.....
#####
....#
...##`).map((s) => s.split(""));

const part2Map = inputToRows(`.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`).map((s) => s.split(""));

const largeExampleMap = inputToRows(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`).map((s) => s.split(""));

test("getAsteroidsInLineOfSight", () => {
  expect(getAsteroidsInLineOfSight(1, 0, part1Map)).toBe(7);
  expect(getAsteroidsInLineOfSight(4, 0, part1Map)).toBe(7);

  expect(getAsteroidsInLineOfSight(0, 2, part1Map)).toBe(6);
  expect(getAsteroidsInLineOfSight(1, 2, part1Map)).toBe(7);
  expect(getAsteroidsInLineOfSight(2, 2, part1Map)).toBe(7);
  expect(getAsteroidsInLineOfSight(3, 2, part1Map)).toBe(7);
  expect(getAsteroidsInLineOfSight(4, 2, part1Map)).toBe(5);

  expect(getAsteroidsInLineOfSight(4, 3, part1Map)).toBe(7);

  expect(getAsteroidsInLineOfSight(3, 4, part1Map)).toBe(8);
  expect(getAsteroidsInLineOfSight(4, 4, part1Map)).toBe(7);
});

test("getSuitableLocationForBase", () => {
  expect(getSuitableLocationForBase(part1Map).asteroidsInLineOfSight).toBe(8);
  expect(getSuitableLocationForBase(part1Map).coordinate).toMatchObject([3, 4]);

  expect(
    getSuitableLocationForBase(largeExampleMap).asteroidsInLineOfSight,
  ).toBe(210);
  expect(getSuitableLocationForBase(largeExampleMap).coordinate).toMatchObject([
    11, 13,
  ]);
});

test("executeCompleteVaporizationByGiantLaser", () => {
  describe("part 2 example map", () => {
    expect(
      executeCompleteVaporizationByGiantLaser([8, 3], part2Map),
    ).toMatchObject([
      [8, 1], // 1
      [9, 0], // 2
      [9, 1], // 3
      [10, 0], // 4
      [9, 2], // 5
      [11, 1], // 6
      [12, 1], // 7
      [11, 2], // 8
      [15, 1], // 9

      [12, 2], // 1
      [13, 2], // 2
      [14, 2], // 3
      [15, 2], // 4
      [12, 3], // 5
      [16, 4], // 6
      [15, 4], // 7
      [10, 4], // 8
      [4, 4], // 9

      [2, 4], // 1
      [2, 3], // 2
      [0, 2], // 3
      [1, 2], // 4
      [0, 1], // 5
      [1, 1], // 6
      [5, 2], // 7
      [1, 0], // 8
      [5, 1], // 9

      [6, 1], // 1
      [6, 0], // 2
      [7, 0], // 3
      [8, 0], // 4
      [10, 1], // 5
      [14, 0], // 6
      [16, 1], // 7
      [13, 3], // 8
      [14, 3], // 9
    ]);
  });

  describe("large example map", () => {
    const largeExampleMapVaporizedAsteroids =
      executeCompleteVaporizationByGiantLaser([11, 13], largeExampleMap);

    expect(largeExampleMapVaporizedAsteroids[0]).toMatchObject([11, 12]);
    expect(largeExampleMapVaporizedAsteroids[1]).toMatchObject([12, 1]);
    expect(largeExampleMapVaporizedAsteroids[2]).toMatchObject([12, 2]);
    expect(largeExampleMapVaporizedAsteroids[9]).toMatchObject([12, 8]);
    expect(largeExampleMapVaporizedAsteroids[19]).toMatchObject([16, 0]);
    expect(largeExampleMapVaporizedAsteroids[49]).toMatchObject([16, 9]);
    expect(largeExampleMapVaporizedAsteroids[99]).toMatchObject([10, 16]);
    expect(largeExampleMapVaporizedAsteroids[198]).toMatchObject([9, 6]);
    expect(largeExampleMapVaporizedAsteroids[199]).toMatchObject([8, 2]);
    expect(largeExampleMapVaporizedAsteroids[200]).toMatchObject([10, 9]);
    expect(largeExampleMapVaporizedAsteroids[298]).toMatchObject([11, 1]);
    expect(largeExampleMapVaporizedAsteroids).toHaveLength(299);
  });
});
