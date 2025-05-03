import { styleText } from "node:util";
import { toInt } from "./input";

export const pixels = {
  black: "black",
  white: "white",
  red: "red",
  green: "green",
  blue: "blue",
} as const;

export type Pixel = keyof typeof pixels;
export type Map = Record<number, Record<number, number>>;
export type ImageData = number[][];
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

function mapToImageData(map: Map): ImageData {
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

  const imageData: ImageData = [];
  for (let y = smallestY; y <= largestY; y++) {
    const row: number[] = [];

    for (let x = smallestX; x <= largestX; x++) {
      row.push(map[y]?.[x] ?? 0);
    }

    imageData.push(row);
  }

  return imageData;
}

function imageDataToImage(
  imageData: ImageData,
  dataToPixel: (data: number) => Pixel,
): Image {
  return imageData.map((row) => row.map(dataToPixel));
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

export function printImageData(
  imageData: ImageData,
  dataToPixel: (data: number) => Pixel = simpleDataToPixel,
): void {
  const image = imageDataToImage(imageData, dataToPixel);
  printImage(image);
}

export function printMap(
  map: Map,
  dataToPixel: (data: number) => Pixel = simpleDataToPixel,
): void {
  const imageData = mapToImageData(map);
  const image = imageDataToImage(imageData, dataToPixel);
  printImage(image);
}

function simpleDataToPixel(data: number): Pixel {
  switch (data) {
    case 0:
      return pixels.black;
    case 1:
      return pixels.white;
    case 2:
      return pixels.red;
    case 3:
      return pixels.green;
    case 4:
      return pixels.blue;
    default:
      throw new Error(`Unknown image data "${data}"`);
  }
}
