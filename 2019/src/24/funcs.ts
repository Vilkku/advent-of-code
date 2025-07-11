import { inputToRows, toInt } from "../util/input.ts";

type Grid = string[][];

export function parseGrid(input: string): Grid {
  return inputToRows(input).map((row) => row.split(""));
}

export function serializeGrid(grid: Grid): string {
  return grid.map((row) => row.join("")).join("");
}

export function calculateBiodiversityRating(grid: Grid): number {
  let exponent = 0;
  let totalPoints = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "#") {
        totalPoints += Math.pow(2, exponent);
      }

      exponent++;
    }
  }

  return totalPoints;
}

export function getNextState(currentState: Grid): Grid {
  const nextState = structuredClone(currentState);

  for (let y = 0; y < currentState.length; y++) {
    for (let x = 0; x < currentState[y].length; x++) {
      const adjacentBugCount = [
        currentState[y - 1]?.[x],
        currentState[y]?.[x + 1],
        currentState[y + 1]?.[x],
        currentState[y]?.[x - 1],
      ].filter((tile) => tile === "#").length;

      if (currentState[y][x] === "#" && adjacentBugCount !== 1) {
        // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
        nextState[y][x] = ".";
      } else if (
        currentState[y][x] === "." &&
        (adjacentBugCount === 1 || adjacentBugCount === 2)
      ) {
        // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
        nextState[y][x] = "#";
      }
    }
  }

  return nextState;
}

export function getNextRepeatingState(initialState: Grid) {
  const stateCache = new Set<string>();
  let currentState = initialState;
  let serializedState = serializeGrid(currentState);

  while (!stateCache.has(serializedState)) {
    stateCache.add(serializedState);
    currentState = getNextState(currentState);
    serializedState = serializeGrid(currentState);
  }

  return currentState;
}

function getTileKey(x: number, y: number, depth: number) {
  if (x === 2 && y === 2) {
    throw new Error("Attempted to get tile key for center of grid");
  }

  return `${depth},${x},${y}`;
}

function parseTileKey(key: string): { x: number; y: number; depth: number } {
  const [depth, x, y] = key.split(",").map(toInt);

  if (x === 2 && y === 2) {
    throw new Error("Attempted to parse tile key of center of grid");
  }

  return { x, y, depth };
}

function getAdjacentTileKeys(tileKey: string): string[] {
  const { depth, x, y } = parseTileKey(tileKey);
  const adjacentTileKeys: string[] = [];

  // Add tiles on other depths
  if (y === 0) {
    adjacentTileKeys.push(getTileKey(2, 1, depth + 1));
  } else if (y === 1 && x === 2) {
    for (let i = 0; i < 5; i++) {
      adjacentTileKeys.push(getTileKey(i, 0, depth - 1));
    }
  } else if (y === 3 && x === 2) {
    for (let i = 0; i < 5; i++) {
      adjacentTileKeys.push(getTileKey(i, 4, depth - 1));
    }
  } else if (y === 4) {
    adjacentTileKeys.push(getTileKey(2, 3, depth + 1));
  }

  if (x === 0) {
    adjacentTileKeys.push(getTileKey(1, 2, depth + 1));
  } else if (x === 1 && y === 2) {
    for (let i = 0; i < 5; i++) {
      adjacentTileKeys.push(getTileKey(0, i, depth - 1));
    }
  } else if (x === 3 && y === 2) {
    for (let i = 0; i < 5; i++) {
      adjacentTileKeys.push(getTileKey(4, i, depth - 1));
    }
  } else if (x === 4) {
    adjacentTileKeys.push(getTileKey(3, 2, depth + 1));
  }

  // Add adjacent tiles on same depth
  [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ].forEach(([adjacentX, adjacentY]) => {
    if (
      adjacentX >= 0 &&
      adjacentX < 5 &&
      adjacentY >= 0 &&
      adjacentY < 5 &&
      !(adjacentX === 2 && adjacentY === 2)
    ) {
      adjacentTileKeys.push(getTileKey(adjacentX, adjacentY, depth));
    }
  });

  return adjacentTileKeys;
}
export function getNextBugs(initialBugs: Set<string>): Set<string> {
  const nextBugs = new Set<string>();
  const tilesToCheck = new Set(initialBugs);
  initialBugs.forEach((tileKey) => {
    getAdjacentTileKeys(tileKey).forEach((adjacentTileKey) =>
      tilesToCheck.add(adjacentTileKey),
    );
  });

  tilesToCheck.forEach((tileKey) => {
    const adjacentBugCount = getAdjacentTileKeys(tileKey).filter(
      (adjacentTileKey) => initialBugs.has(adjacentTileKey),
    ).length;

    if (initialBugs.has(tileKey)) {
      if (adjacentBugCount === 1) {
        // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
        nextBugs.add(tileKey);
      }
    } else {
      if (adjacentBugCount === 1 || adjacentBugCount === 2) {
        // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
        nextBugs.add(tileKey);
      }
    }
  });

  return nextBugs;
}

export function getBugsAfterNIterations(
  initialState: Grid,
  iterations: number,
): number {
  const initialBugs = new Set<string>();

  for (let y = 0; y < initialState.length; y++) {
    for (let x = 0; x < initialState[y].length; x++) {
      if (initialState[y][x] === "#") {
        initialBugs.add(getTileKey(x, y, 0));
      }
    }
  }

  let currentBugs = new Set(initialBugs);
  for (let i = 0; i < iterations; i++) {
    currentBugs = getNextBugs(currentBugs);
  }

  return currentBugs.size;
}
