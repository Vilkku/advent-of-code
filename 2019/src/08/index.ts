import { getInput, toInt } from "../util/input.ts";
import { styleText } from "node:util";

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
  const layerZeroCount = layer.reduce((prev, curr) => {
    if (curr === 0) {
      return prev + 1;
    } else {
      return prev;
    }
  }, 0);

  layers.push(layer);
  layerZeroCounts.push(layerZeroCount);
}

const layerWithFewestZeroesIndex = layerZeroCounts.indexOf(
  Math.min(...layerZeroCounts),
);

const digitsInLayerWithFewestZeroes = layers[layerWithFewestZeroesIndex].reduce<
  Record<number, number>
>((prev, curr) => {
  if (!prev[curr]) {
    prev[curr] = 0;
  }

  return {
    ...prev,
    [curr]: prev[curr] + 1,
  };
}, {});

console.log(
  "Part 1",
  digitsInLayerWithFewestZeroes[1] * digitsInLayerWithFewestZeroes[2],
);

const image: number[][] = [];
for (let y = 0; y < height; y++) {
  image[y] = [];
  for (let x = 0; x < width; x++) {
    const pixelIndex = y * width + x;
    const topmostPixel = layers.reduce<number>((prev, layer) => {
      if (prev === 2) {
        return layer[pixelIndex];
      }

      return prev;
    }, 2);

    image[y].push(topmostPixel);
  }
}

const pixelStr = "██";
const printedWidth = width * pixelStr.length;

console.log(
  `+${" Part 2 ".padStart(printedWidth / 2 + 4, "-").padEnd(printedWidth, "-")}+`,
);
image.forEach((row) => {
  console.log(
    "|" +
      row
        .map((pixel) => {
          switch (pixel) {
            case 0:
              return styleText("black", pixelStr);
            case 1:
              return styleText("white", pixelStr);
            default:
              throw new Error(`Unexpected pixel "${pixel}"`);
          }
        })
        .join("") +
      "|",
  );
});
console.log(`+${"".padStart(printedWidth, "-")}+`);
