import { expect, test } from "bun:test";
import { part1, part2, getPart2LineCalibrationDigits } from "../src/1";

test("part 1", () => {
  const input = `1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet
  `;

  expect(part1(input)).toBe(142);
});

test("part 2", () => {
  const input = `two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen
  `;

  expect(part2(input)).toBe(281);
});

const lines = {
  two1nine: 29,
  eightwothree: 83,
  abcone2threexyz: 13,
  xtwone3four: 24,
  "4nineeightseven2": 42,
  zoneight234: 14,
  "7pqrstsixteen": 76,
  685: 65,
  seven8sevenptdlvvgssixvjvzpvsp7fivefourtwoned: 71,
  sixfourgkdlxtqmbzkgmpmcsevenhzrt4: 64,
  xzvxcvpdftpllcxvpbtwoxkspeightvmfhlqxklthree1: 21,
  "2onetwo": 22,
  "98lztb": 98,
  "2r": 22,
  eightwo: 82,
};

Object.entries(lines).forEach(([line, expected]) => {
  test(`${line} => ${expected}`, () => {
    expect(getPart2LineCalibrationDigits(line)).toBe(expected);
  });
});
