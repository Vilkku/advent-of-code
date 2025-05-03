import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { toInt } from "../util/input.ts";
import { type Map, pixels } from "../util/map.ts";

// North, South, West, East
const directions = [1, 2, 3, 4] as const;
type Direction = (typeof directions)[number];

export const tiles = {
  wall: pixels.black,
  floor: pixels.white,
  oxygen: pixels.red,
} as const;

function run(
  initialMemory: number[],
  direction: Direction,
): { output: number; memory: number[] } {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        return { output: computerStatus.output, memory: computer.memory };
      case "input":
        computer.enqueueInput(direction);
        computerStatus = computer.run();
        break;
    }
  }

  throw new Error("Unexpected done status");
}

function getNextXY(x: number, y: number, direction: number): [number, number] {
  switch (direction) {
    case 1:
      return [x, y + 1];
    case 2:
      return [x, y - 1];
    case 3:
      return [x - 1, y];
    case 4:
      return [x + 1, y];
    default:
      throw new Error(`Unexpected direction ${direction}`);
  }
}

function coordinateIsMapped(x: number, y: number, map: Map) {
  return map[y] && map[y][x] && typeof map[y][x] !== "undefined";
}

export function explore(
  x: number,
  y: number,
  currentMemory: number[],
  map: Map,
  iteration = 0,
) {
  const unexploredDirections: Direction[] = directions.filter((direction) => {
    const [nextX, nextY] = getNextXY(x, y, direction);

    return !coordinateIsMapped(nextX, nextY, map);
  });

  iteration++;

  const results = unexploredDirections.map((direction): number => {
    const [nextX, nextY] = getNextXY(x, y, direction);

    if (!map[nextY]) {
      map[nextY] = {};
    }

    const computerStatus = run(currentMemory, direction);

    switch (computerStatus.output) {
      case 0:
        map[nextY][nextX] = tiles.wall;
        return 0;
      case 1:
        map[nextY][nextX] = tiles.floor;
        return explore(nextX, nextY, computerStatus.memory, map, iteration);
      case 2:
        map[nextY][nextX] = tiles.oxygen;
        // Continue exploring to get complete map but do not use that for returned iteration count
        explore(nextX, nextY, computerStatus.memory, map, iteration);
        return iteration;
      default:
        throw new Error(`Invalid output ${computerStatus.output}`);
    }
  });

  return results.reduce((sum, a) => sum + a, 0);
}

function getAdjacentFloors(x: number, y: number, map: Map): [number, number][] {
  return directions
    .map((direction) => getNextXY(x, y, direction))
    .filter(
      ([nextX, nextY]) =>
        coordinateIsMapped(nextX, nextY, map) &&
        map[nextY][nextX] === tiles.floor,
    );
}

function spreadOxygen(
  floors: [number, number][],
  floorTiles: Set<string>,
  map: Map,
  iteration = -1,
): number {
  floors.forEach(([x, y]) => {
    floorTiles.delete(`${x},${y}`);
  });

  iteration++;

  return Math.max(
    ...floors.flatMap(([x, y]) => {
      const adjacentFloors = getAdjacentFloors(x, y, map).filter(([x, y]) =>
        floorTiles.has(`${x},${y}`),
      );

      if (adjacentFloors.length === 0) {
        return iteration;
      }

      return spreadOxygen(adjacentFloors, floorTiles, map, iteration);
    }),
  );
}

export function spreadOxygenToAllFloors(map: Map) {
  let oxygenX: number | undefined = undefined;
  let oxygenY: number | undefined = undefined;

  const floorTiles = new Set(
    Object.entries(map)
      .flatMap(([y, row]) =>
        Object.entries(row).map(([x, tile]): string | undefined => {
          if (tile === tiles.oxygen) {
            oxygenX = toInt(x);
            oxygenY = toInt(y);
          }

          if (tile === tiles.floor) {
            return `${x},${y}`;
          }

          return undefined;
        }),
      )
      .filter((value): value is string => typeof value === "string"),
  );

  if (!oxygenX || !oxygenY) {
    throw new Error("Did not find oxygen");
  }

  return spreadOxygen([[oxygenX, oxygenY]], floorTiles, map);
}
