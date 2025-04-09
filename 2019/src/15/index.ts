import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { expect } from "bun:test";
import { useBenchmark } from "../util/benchmark.ts";
import { run } from "./funcs.ts";
import {
  getSmallestAndLargestKeysInRecord,
  print2DArray,
} from "../util/print2DArray.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);
const benchmark = useBenchmark();

benchmark.reset();

// North, South, West, East
type Direction = 1 | 2 | 3 | 4;
const map: Record<number, Record<number, number>> = { 0: { 0: 1 } };
let x = 0;
let y = 0;
let dir: Direction = 1;

function getNextXY(currentX: number, currentY: number, currentDir: Direction) {
  function getDirXY() {
    switch (currentDir) {
      case 1:
        return { dirX: 0, dirY: 1 };
      case 2:
        return { dirX: 0, dirY: -1 };
      case 3:
        return { dirX: -1, dirY: 0 };
      case 4:
        return { dirX: 1, dirY: 0 };
    }
  }

  const { dirX, dirY } = getDirXY();

  return {
    nextX: currentX + dirX,
    nextY: currentY + dirY,
  };
}

function getNextDir(
  currentX: number,
  currentY: number,
  startDir: Direction,
): Direction {
  function turnClockwise(currentDir: Direction) {
    switch (currentDir) {
      case 1:
        return 4;
      case 2:
        return 3;
      case 3:
        return 1;
      case 4:
        return 2;
    }
  }

  let currentDir = startDir;
  let nextXY = getNextXY(currentX, currentY, currentDir);

  do {
    nextXY = getNextXY(currentX, currentY, currentDir);

    if (
      typeof map[nextXY.nextY] === "undefined" ||
      typeof map[nextXY.nextY][nextXY.nextX] === "undefined"
    ) {
      return currentDir;
    }

    currentDir = turnClockwise(currentDir);
  } while (currentDir !== startDir);

  return turnClockwise(turnClockwise(startDir));
}

let i = 0;
await run(initialMemory, {
  onOutput: (status) => {
    const { nextX, nextY } = getNextXY(x, y, dir);

    if (!map[nextY]) {
      map[nextY] = {};
    }

    console.log(`Droid at ${x}, ${y}`);

    switch (status) {
      case 0:
        map[nextY][nextX] = 0;

        console.log(`Wall at ${nextX}, ${nextY}`);

        break;
      case 1:
        x = nextX;
        y = nextY;

        map[nextY][nextX] = 1;
        break;
      case 2:
        x = nextX;
        y = nextY;

        map[nextY][nextX] = 2;
        return true;
      default:
        throw new Error(`Invalid status ${status}`);
    }

    i++;
    if (i > 200) {
      return true;
    }

    return false;
  },
  onInput: async () => {
    dir = getNextDir(x, y, dir);
    return dir;
  },
});

const { min: smallestY, max: largestY } =
  getSmallestAndLargestKeysInRecord(map);

let smallestX = 0;
let largestX = 0;

Object.values(map).forEach((row) => {
  const { min, max } = getSmallestAndLargestKeysInRecord(row);

  if (min < smallestX) {
    smallestX = min;
  }

  if (max > largestX) {
    largestX = max;
  }
});

const image: number[][] = [];
for (let y = smallestY; y <= largestY; y++) {
  const row = [];

  for (let x = smallestX; x <= largestX; x++) {
    row.push(map[y]?.[x]);
  }

  image.push(row);
}

print2DArray(
  image,
  "Part 2",
  (px) => {
    switch (px) {
      case 0:
        return "#";
      case 1:
        return ".";
      case 2:
        return "X";
      default:
        return " ";
    }
  },
  " ",
);

const part1Answer = 1;

console.log("Part 1", part1Answer);
benchmark.get();
expect(part1Answer).toBe(312);
