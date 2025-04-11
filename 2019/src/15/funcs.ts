import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

// North, South, West, East
const directions = [1, 2, 3, 4] as const;
type Direction = (typeof directions)[number];
export type Map = Record<number, Record<number, 0 | 1 | 2>>;

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

export function explore(
  x: number,
  y: number,
  currentMemory: number[],
  map: Map = { 0: { 0: 1 } },
  iteration = 0,
) {
  const unexploredDirections: Direction[] = directions.filter((direction) => {
    const [nextX, nextY] = getNextXY(x, y, direction);

    return !(
      map[nextY] &&
      map[nextY][nextX] &&
      typeof map[nextY][nextX] !== "undefined"
    );
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
        map[nextY][nextX] = 0;
        return 0;
      case 1:
        map[nextY][nextX] = 1;
        return explore(nextX, nextY, computerStatus.memory, map, iteration);
      case 2:
        map[nextY][nextX] = 2;
        return iteration;
      default:
        throw new Error(`Invalid output ${computerStatus.output}`);
    }
  });

  return results.reduce((sum, a) => sum + a, 0);
}
