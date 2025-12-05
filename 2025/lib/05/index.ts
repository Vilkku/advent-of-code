import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32
`;

function parseIngredients(input: string): {
  freshRanges: [number, number][];
  freshIngredients: number[];
} {
  const freshIngredients: number[] = [];

  const [freshRangesRaw, ingredientIdsRaw] = input.trim().split("\n\n");

  const freshRanges: [number, number][] = freshRangesRaw!
    .split("\n")
    .map((row) => {
      const [start, end] = row.split("-");

      return [parseInt(start!, 10), parseInt(end!, 10)];
    });

  const ingredientIds = ingredientIdsRaw!
    .split("\n")
    .map((idStr) => parseInt(idStr, 10));

  ingredientIds.forEach((id) => {
    if (freshRanges.some(([start, end]) => id >= start && id <= end)) {
      freshIngredients.push(id);
    }
  });

  return { freshRanges, freshIngredients };
}

printAnswer(
  "Part 1",
  () => {
    const { freshIngredients } = parseIngredients(input);

    return freshIngredients.length;
  },
  756,
);

printAnswer(
  "Part 2",
  () => {
    const { freshRanges } = parseIngredients(input);
    const sortedRanges = [...freshRanges].sort((a, b) => a[0] - b[0]);

    const mergedRanges = sortedRanges.reduce<[number, number][]>(
      (acc, curr) => {
        if (acc.length === 0) {
          return [curr];
        }

        const prev = acc.pop();

        if (!prev) {
          throw new Error("Error getting last element of array");
        }

        const [currStart, currEnd] = curr;
        const [prevStart, prevEnd] = prev;

        if (currEnd <= prevEnd) {
          return [...acc, prev];
        }

        if (currStart <= prevEnd) {
          return [...acc, [prevStart, currEnd]];
        }

        return [...acc, prev, curr];
      },
      [],
    );

    return mergedRanges.reduce((sum, [start, end]) => sum + end - start + 1, 0);
  },
  355555479253787,
);
