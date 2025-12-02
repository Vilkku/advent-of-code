import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput =
  "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

type IdRange = {
  start: number;
  end: number;
};

function parseIdRanges(input: string): IdRange[] {
  return input
    .trim()
    .split(",")
    .map((range) => {
      const [startStr, endStr] = range.split("-");

      if (!startStr || !endStr) {
        throw new Error(`Could not parse ${range}`);
      }

      return {
        start: parseInt(startStr, 10),
        end: parseInt(endStr, 10),
      };
    });
}

printAnswer(
  "Part 1",
  () => {
    const idRanges = parseIdRanges(input);
    const invalidIds: number[] = [];

    // Could be done with this regex ^(\d+)\1$

    idRanges.forEach(({ start, end }) => {
      for (let i = start; i <= end; i++) {
        const iStr = i.toString();

        if (iStr.length % 2 !== 0) {
          continue;
        }

        if (
          iStr.substring(0, iStr.length / 2) !== iStr.substring(iStr.length / 2)
        ) {
          continue;
        }

        invalidIds.push(i);
      }
    });

    return invalidIds.reduce((prev, curr) => prev + curr, 0);
  },
  31839939622,
);

printAnswer(
  "Part 2",
  () => {
    const idRanges = parseIdRanges(input);
    const invalidIds: number[] = [];

    // Could be done with this regex ^(\d+)\1+$

    idRanges.forEach(({ start, end }) => {
      for (let i = start; i <= end; i++) {
        const iStr = i.toString();

        for (let l = 2; l <= iStr.length; l++) {
          if (iStr.length % l !== 0) {
            continue;
          }

          if (iStr.substring(0, iStr.length / l).repeat(l) !== iStr) {
            continue;
          }

          invalidIds.push(i);
          break;
        }
      }
    });

    return invalidIds.reduce((prev, curr) => prev + curr, 0);
  },
  41662374059,
);
