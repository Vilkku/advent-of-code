import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`;

function parsePaperRolls(input: string): Set<string> {
  const paperRolls = new Set<string>();

  input
    .trim()
    .split("\n")
    .forEach((row, rowIndex) =>
      row.split("").forEach((pos, colIndex) => {
        if (pos === "@") {
          paperRolls.add(createCoordinate(rowIndex, colIndex));
        }
      }),
    );

  return paperRolls;
}

function createCoordinate(row: number, col: number): string {
  return `${col},${row}`;
}

function getAdjacentCoordinates(coordinate: string): string[] {
  const [colStr, rowStr] = coordinate.split(",");

  if (!rowStr || !colStr) {
    throw new Error(`Invalid coordinate ${coordinate}`);
  }

  const row = parseInt(rowStr, 10);
  const col = parseInt(colStr, 10);

  return [
    createCoordinate(row - 1, col - 1),
    createCoordinate(row - 1, col),
    createCoordinate(row - 1, col + 1),
    createCoordinate(row, col + 1),
    createCoordinate(row + 1, col + 1),
    createCoordinate(row + 1, col),
    createCoordinate(row + 1, col - 1),
    createCoordinate(row, col - 1),
  ];
}

function getAccesiblePaperRolls(paperRolls: Set<string>): string[] {
  return [...paperRolls].filter((coordinate) => {
    const adjacentCorodinates = getAdjacentCoordinates(coordinate);
    let adjacentRolls = 0;

    for (const adjacentCoordinate of adjacentCorodinates) {
      if (paperRolls.has(adjacentCoordinate)) {
        adjacentRolls++;
      }

      if (adjacentRolls >= 4) {
        break;
      }
    }

    return adjacentRolls < 4;
  });
}

printAnswer(
  "Part 1",
  () => {
    const paperRolls = parsePaperRolls(input);
    const accessiblePaperRolls = getAccesiblePaperRolls(paperRolls);

    return accessiblePaperRolls.length;
  },
  1441,
);

printAnswer(
  "Part 2",
  () => {
    const paperRolls = parsePaperRolls(input);
    let accessiblePaperRolls: string[] = [];
    let removedRolls = 0;

    do {
      accessiblePaperRolls = getAccesiblePaperRolls(paperRolls);
      accessiblePaperRolls.forEach((coordinate) => {
        paperRolls.delete(coordinate);
      });

      removedRolls += accessiblePaperRolls.length;
    } while (accessiblePaperRolls.length > 0);

    return removedRolls;
  },
  9050,
);
