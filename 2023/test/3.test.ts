import { expect, test } from "bun:test";
import { part1, part2 } from "../src/3";

const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

test("part 1", () => {
  expect(part1(input)).toBe(4361);
});

test("part 2", () => {
  expect(part2(input)).toBe(467835);
});
