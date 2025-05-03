import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { type Image, type Pixel, pixels } from "../util/map.ts";

export const tiles = {
  space: pixels.black,
  scaffold: pixels.white,
  robot: pixels.red,
} as const;

export function generateImage(initialMemory: number[]): Image {
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
  return computer.outputs.reduce<Image>((resultArray, item) => {
    if (item === 10) {
      currentChunk++;
      return resultArray;
    }

    if (!resultArray[currentChunk]) {
      resultArray[currentChunk] = [];
    }

    resultArray[currentChunk].push(asciiToPixel(item));

    return resultArray;
  }, []);
}

function asciiToPixel(tile: number): Pixel {
  switch (tile) {
    case 35:
      return tiles.scaffold;
    case 46:
      return tiles.space;
    default:
      return tiles.robot;
  }
}

function findIntersections(image: Image): [number, number][] {
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

export function getSumOfAlignmentParameters(image: Image): number {
  const intersections = findIntersections(image);

  return intersections.reduce((sum, intersection) => {
    return sum + getAlignmentParameter(intersection);
  }, 0);
}
