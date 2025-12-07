import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`;

printAnswer(
  "Part 1",
  () => {
    const beams: Set<number> = new Set();
    const splittersByRow: Record<number, number[]> = {};

    const rows = input.trim().split("\n");

    rows.forEach((row, rowIndex) => {
      row.split("").forEach((col, colIndex) => {
        switch (col) {
          case "S":
            beams.add(colIndex);
            break;
          case "^":
            if (!splittersByRow[rowIndex]) {
              splittersByRow[rowIndex] = [];
            }

            splittersByRow[rowIndex].push(colIndex);
            break;
          default:
            break;
        }
      });
    });

    let splits = 0;
    for (let i = 0; i < rows.length; i++) {
      const rowSplitters = splittersByRow[i] ?? [];

      if (rowSplitters.length === 0) {
        continue;
      }

      rowSplitters.forEach((splitterCol) => {
        if (beams.has(splitterCol)) {
          splits++;
          beams.delete(splitterCol);
          beams.add(splitterCol - 1);
          beams.add(splitterCol + 1);
        }
      });
    }

    return splits;
  },
  1592,
);

printAnswer("Part 2", () => {
  const countsByCol: Map<number, number> = new Map();
  const splittersByRow: Record<number, number[]> = {};

  const rows = input.trim().split("\n");

  rows.forEach((row, rowIndex) => {
    row.split("").forEach((col, colIndex) => {
      switch (col) {
        case "S":
          countsByCol.set(colIndex, 1);
          break;
        case "^":
          if (!splittersByRow[rowIndex]) {
            splittersByRow[rowIndex] = [];
          }

          splittersByRow[rowIndex].push(colIndex);
          break;
        default:
          break;
      }
    });
  });

  for (let i = 0; i < rows.length; i++) {
    const rowSplitters = splittersByRow[i] ?? [];

    if (rowSplitters.length === 0) {
      continue;
    }

    const newCounts: Map<number, number> = new Map();

    rowSplitters.forEach((splitterCol) => {
      const incoming = countsByCol.get(splitterCol) ?? 0;

      if (incoming > 0) {
        newCounts.set(
          splitterCol,
          (newCounts.get(splitterCol) ?? 0) - incoming,
        );
        newCounts.set(
          splitterCol - 1,
          (newCounts.get(splitterCol - 1) ?? 0) + incoming,
        );
        newCounts.set(
          splitterCol + 1,
          (newCounts.get(splitterCol + 1) ?? 0) + incoming,
        );
      }
    });

    for (const [col, count] of newCounts) {
      const value = (countsByCol.get(col) ?? 0) + count;

      if (value === 0) {
        countsByCol.delete(col);
      } else {
        countsByCol.set(col, value);
      }
    }
  }

  return [...countsByCol].reduce((acc, [_, count]) => acc + count, 0);
});
