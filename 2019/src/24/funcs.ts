import { inputToRows } from "../util/input.ts";

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
