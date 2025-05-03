import { getInput, toInt } from "../util/input.ts";
import { type Image, pixels, printImage } from "../util/map.ts";

const input = (await getInput(import.meta.dir, "input.txt"))
  .split("")
  .map(toInt);

const width = 25;
const height = 6;
const pixelsPerLayer = width * height;
const layers: number[][] = [];
const layerZeroCounts: number[] = [];

for (let i = 0; i < input.length; i += pixelsPerLayer) {
  const layer = input.slice(i, i + pixelsPerLayer);
  const layerZeroCount = layer.filter((n) => n === 0).length;

  layers.push(layer);
  layerZeroCounts.push(layerZeroCount);
}

const layerWithFewestZeroesIndex = layerZeroCounts.indexOf(
  Math.min(...layerZeroCounts),
);

const digitsInLayerWithFewestZeroes = layers[layerWithFewestZeroesIndex].reduce<
  Record<number, number>
>((acc, num) => {
  acc[num] = (acc[num] || 0) + 1;
  return acc;
}, {});

console.log(
  "Part 1",
  digitsInLayerWithFewestZeroes[1] * digitsInLayerWithFewestZeroes[2],
);

const image: Image = [];
for (let y = 0; y < height; y++) {
  image[y] = [];
  for (let x = 0; x < width; x++) {
    const pxIndex = y * width + x;
    const topmostPx =
      layers.find((layer) => layer[pxIndex] !== 2)?.[pxIndex] ?? 0;

    image[y].push(topmostPx === 0 ? pixels.black : pixels.white);
  }
}

printImage(image);
