import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { type ImageData, type Pixel, pixels } from "../util/map.ts";

export const tiles = {
  scaffold: 35,
  space: 46,
} as const;

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

function findIntersections(image: ImageData): [number, number][] {
  const intersections: [number, number][] = [];

  // No intersections on the edges
  for (let y = 1; y < image.length - 1; y++) {
    for (let x = 1; x < image[y].length - 1; x++) {
      const tilesToCheck = [
        image[y][x],
        image[y][x - 1],
        image[y][x + 1],
        image[y - 1][x],
        image[y + 1][x],
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

export function getSumOfAlignmentParameters(image: ImageData): number {
  const intersections = findIntersections(image);

  return intersections.reduce((sum, intersection) => {
    return sum + getAlignmentParameter(intersection);
  }, 0);
}
