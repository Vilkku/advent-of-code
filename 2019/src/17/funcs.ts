import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { type ImageData, type Pixel, pixels } from "../util/map.ts";

export const tiles = {
  scaffold: 35,
  space: 46,
} as const;

type Direction = "u" | "d" | "l" | "r";

export function generateImageData(initialMemory: number[]): ImageData {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        computerStatus = computer.run();
        break;
      case "input":
        throw new Error("Unexpected input status");
    }
  }

  let currentChunk = 0;
  return computer.outputs.reduce<ImageData>((resultArray, item) => {
    if (item === 10) {
      currentChunk++;
      return resultArray;
    }

    if (!resultArray[currentChunk]) {
      resultArray[currentChunk] = [];
    }

    resultArray[currentChunk].push(item);

    return resultArray;
  }, []);
}

export function asciiToPixel(tile: number): Pixel {
  switch (tile) {
    case tiles.scaffold:
      return pixels.white;
    case tiles.space:
      return pixels.black;
    default:
      return pixels.red;
  }
}

function findIntersections(imageData: ImageData): [number, number][] {
  const intersections: [number, number][] = [];

  // No intersections on the edges
  for (let y = 1; y < imageData.length - 1; y++) {
    for (let x = 1; x < imageData[y].length - 1; x++) {
      const tilesToCheck = [
        imageData[y][x],
        imageData[y][x - 1],
        imageData[y][x + 1],
        imageData[y - 1][x],
        imageData[y + 1][x],
      ];

      if (tilesToCheck.every((tile) => tile === tiles.scaffold)) {
        intersections.push([x, y]);
      }
    }
  }

  return intersections;
}

function getAlignmentParameter([x, y]: [number, number]): number {
  return x * y;
}

export function getSumOfAlignmentParameters(imageData: ImageData): number {
  const intersections = findIntersections(imageData);

  return intersections.reduce((sum, intersection) => {
    return sum + getAlignmentParameter(intersection);
  }, 0);
}

function getStartAndDirection(imageData: ImageData): {
  x: number;
  y: number;
  direction: Direction;
} {
  for (let y = 0; y < imageData.length; y++) {
    for (let x = 0; x < imageData[y].length; x++) {
      if (
        !([tiles.scaffold, tiles.space] as number[]).includes(imageData[y][x])
      ) {
        switch (String.fromCharCode(imageData[y][x])) {
          case "^":
            return {
              direction: "u",
              x,
              y,
            };
          case "v":
            return {
              direction: "d",
              x,
              y,
            };
          case "<":
            return {
              direction: "l",
              x,
              y,
            };
          case ">":
            return {
              direction: "r",
              x,
              y,
            };
          default:
            throw new Error(`Unknown character code "${imageData[y][x]}"`);
        }
      }
    }
  }

  throw new Error("Could not find start coordinates");
}

function getNextXY(
  x: number,
  y: number,
  direction: Direction,
): [number, number] {
  switch (direction) {
    case "u":
      return [x, y - 1];
    case "d":
      return [x, y + 1];
    case "l":
      return [x - 1, y];
    case "r":
      return [x + 1, y];
    default:
      throw new Error(`Unexpected direction ${direction}`);
  }
}

function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "u":
      return "r";
    case "d":
      return "l";
    case "l":
      return "u";
    case "r":
      return "d";
  }
}

function turnLeft(direction: Direction): Direction {
  switch (direction) {
    case "u":
      return "l";
    case "d":
      return "r";
    case "l":
      return "d";
    case "r":
      return "u";
  }
}

function getNextInstructionAndData(
  currentX: number,
  currentY: number,
  directionForward: Direction,
  imageData: ImageData,
): {
  x: number;
  y: number;
  instruction: "R" | "L" | "F";
  direction: Direction;
} | null {
  const [nextXForward, nextYForward] = getNextXY(
    currentX,
    currentY,
    directionForward,
  );

  if (
    imageData[nextYForward]?.[nextXForward] &&
    imageData[nextYForward][nextXForward] === tiles.scaffold
  ) {
    return {
      x: nextXForward,
      y: nextYForward,
      instruction: "F",
      direction: directionForward,
    };
  }

  const directionRight = turnRight(directionForward);
  const [nextXRight, nextYRight] = getNextXY(
    currentX,
    currentY,
    directionRight,
  );

  if (
    imageData[nextYRight]?.[nextXRight] &&
    imageData[nextYRight][nextXRight] === tiles.scaffold
  ) {
    return {
      x: currentX,
      y: currentY,
      instruction: "R",
      direction: directionRight,
    };
  }

  const directionLeft = turnLeft(directionForward);
  const [nextXLeft, nextYLeft] = getNextXY(currentX, currentY, directionLeft);

  if (
    imageData[nextYLeft]?.[nextXLeft] &&
    imageData[nextYLeft][nextXLeft] === tiles.scaffold
  ) {
    return {
      x: currentX,
      y: currentY,
      instruction: "L",
      direction: directionLeft,
    };
  }

  return null;
}

function rawInstructionToInstruction(rawInstruction: string): number[] {
  let instructionParts: number[] = [];
  const rawInstructionArr = rawInstruction.split("");
  let fCounter = 0;

  for (let i = 0; i < rawInstructionArr.length; i++) {
    if (rawInstructionArr[i] !== "F") {
      if (fCounter > 0) {
        instructionParts.push(
          ...fCounter
            .toString()
            .split("")
            .map((s) => s.charCodeAt(0)),
        );
        fCounter = 0;
      }

      instructionParts.push(rawInstructionArr[i].charCodeAt(0));
    } else {
      fCounter++;
    }
  }

  if (fCounter > 0) {
    instructionParts.push(
      ...fCounter
        .toString()
        .split("")
        .map((s) => s.charCodeAt(0)),
    );
  }

  return instructionParts.flatMap((x) => [44, x]).slice(1);
}

type BestSubstring = {
  substring: string;
  matches: number;
  total: number;
  instruction: number[];
  ratio: number;
};

function getBestSubstrings(
  fullString: string,
  invalidCharacters: string[],
): BestSubstring[] {
  const bestSubstrings: BestSubstring[] = [];

  for (let start = 0; start < fullString.length; start++) {
    let numMatches = 0;
    let end = start + 1;

    do {
      const substring = fullString.substring(start, end);

      if (
        invalidCharacters.some((invalidCharacter) =>
          substring.includes(invalidCharacter),
        )
      ) {
        numMatches = 0;
      } else {
        const matches = [...fullString.matchAll(new RegExp(substring, "g"))];

        numMatches = matches.length;
        end++;

        // console.log(substring, numMatches);
        if (numMatches > 1 && numMatches < 20) {
          const total = numMatches * substring.length;
          const instruction = rawInstructionToInstruction(substring);
          const ratio = total / numMatches;

          if (instruction.length <= 20 && ratio > 1) {
            bestSubstrings.push({
              substring,
              matches: numMatches,
              total,
              instruction,
              ratio,
            });
          }
        }
      }
    } while (numMatches > 1 && end <= fullString.length);
  }

  bestSubstrings.sort((a, b) => b.substring.length - a.substring.length);

  return bestSubstrings.slice(0, 30);
}

// Thanks ChatGPT
function fullReplacements(
  input: string,
  target: string,
  replacement: string,
): string[] {
  const n = input.length;
  const m = target.length;

  // 1) dp[i] = maximum # of replacements we can still do from position i
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    // option A: skip this char
    const skip = dp[i + 1];
    // option B: replace here (if it matches)
    const take = input.startsWith(target, i) ? 1 + dp[i + m] : 0;
    dp[i] = Math.max(skip, take);
  }

  // 2) backtrack only along paths that reach dp[0] total replacements
  const results = new Set<string>();
  function dfs(current: string, i: number) {
    if (i >= n) {
      results.add(current);
      return;
    }

    // If matching + taking here still can reach the max
    if (input.startsWith(target, i) && 1 + dp[i + m] === dp[i]) {
      dfs(current + replacement, i + m);
    }

    // If skipping this char still can reach the max
    if (dp[i + 1] === dp[i]) {
      dfs(current + input[i], i + 1);
    }
  }

  dfs("", 0);
  return Array.from(results);
}

export function findPathToEnd(imageData: ImageData) {
  const {
    x: startX,
    y: startY,
    direction: startDirection,
  } = getStartAndDirection(imageData);

  const instructions = [];
  let x = startX;
  let y = startY;
  let direction = startDirection;
  let complete = false;

  while (!complete) {
    const nextInstructionAndData = getNextInstructionAndData(
      x,
      y,
      direction,
      imageData,
    );

    if (!nextInstructionAndData) {
      complete = true;
    } else {
      instructions.push(nextInstructionAndData.instruction);
      x = nextInstructionAndData.x;
      y = nextInstructionAndData.y;
      direction = nextInstructionAndData.direction;
    }
  }

  let fullInstructionString = instructions.join("");

  console.log(fullInstructionString);

  const bestASubstrings = getBestSubstrings(fullInstructionString, []);

  for (let bestASubstring of bestASubstrings) {
    const fullInstructionStringsWithA = fullReplacements(
      fullInstructionString,
      bestASubstring.substring,
      "A",
    );

    for (let fullInstructionStringWithA of fullInstructionStringsWithA) {
      const bestBSubstrings = getBestSubstrings(fullInstructionStringWithA, [
        "A",
      ]);

      for (let bestBSubstring of bestBSubstrings) {
        const fullInstructionStringsWithAB = fullReplacements(
          fullInstructionStringWithA,
          bestBSubstring.substring,
          "B",
        );

        for (let fullInstructionStringWithAB of fullInstructionStringsWithAB) {
          const bestCSubstrings = getBestSubstrings(
            fullInstructionStringWithAB,
            ["A", "B"],
          );

          for (let bestCSubstring of bestCSubstrings) {
            const fullInstructionStringsWithABC = fullReplacements(
              fullInstructionStringWithAB,
              bestCSubstring.substring,
              "C",
            );

            for (let fullInstructionStringWithABC of fullInstructionStringsWithABC) {
              const isValidSolution = !(
                fullInstructionStringWithABC.includes("L") ||
                fullInstructionStringWithABC.includes("R") ||
                fullInstructionStringWithABC.includes("F")
              );

              console.log({
                a: bestASubstring.substring,
                b: bestBSubstring.substring,
                c: bestCSubstring.substring,
                f: fullInstructionStringWithABC,
              });

              if (isValidSolution) {
                throw new Error("Actually found a valid solution lol");
              }
            }
          }
        }
      }
    }
  }

  throw new Error("Didn't find any solution :(");
}
