import { styleText } from "node:util";
import { toInt } from "./input";

export const pixels = {
  black: "black",
  white: "white",
  red: "red",
  green: "green",
  blue: "blue",
} as const;

type Pixel = keyof typeof pixels;
export type Map = Record<number, Record<number, Pixel>>;
export type Image = Pixel[][];

function getSmallestAndLargestKeysInRecord(record: Record<number, unknown>): {
  min: number;
  max: number;
} {
  // Keys are actually strings so need to use a custom sort function
  const sortedKeys = [...Object.keys(record)].map(toInt).sort((a, b) => a - b);

  return {
    min: sortedKeys.at(0) ?? 0,
    max: sortedKeys.at(-1) ?? 0,
  };
}

function mapToImage(map: Map): Image {
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

  const image: Image = [];
  for (let y = smallestY; y <= largestY; y++) {
    const row: Pixel[] = [];

    for (let x = smallestX; x <= largestX; x++) {
      row.push(map[y]?.[x] ?? pixels.black);
    }

    image.push(row);
  }

  return image;
}

export function printImage(image: Image): void {
  function renderPixel(pixel: Pixel) {
    if (!pixels[pixel]) {
      throw new Error(`Unexpected pixel "${pixel}"`);
    }

    return styleText(pixels[pixel], "██");
  }

  image.forEach((row) => {
    console.log(row.map((px) => renderPixel(px)).join(""));
  });
}

export function printMap(map: Map): void {
  printImage(mapToImage(map));
}
