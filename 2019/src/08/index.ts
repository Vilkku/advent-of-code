import { getInput, toInt } from "../util/input.ts";
import { styleText } from "node:util";
import { useBenchmark } from "../util/benchmark.ts";

const input = (await getInput(import.meta.dir, "input.txt"))
  .split("")
  .map(toInt);

const benchmark = useBenchmark();

benchmark.start("Part 1");

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

benchmark.print("Part 1");
benchmark.start("Part 2");

const px = {
  black: 0,
  white: 1,
  transparent: 2,
} as const;

const image: number[][] = [];
for (let y = 0; y < height; y++) {
  image[y] = [];
  for (let x = 0; x < width; x++) {
    const pxIndex = y * width + x;
    const topmostPx =
      layers.find((layer) => layer[pxIndex] !== px.transparent)?.[pxIndex] ??
      px.transparent;

    image[y].push(topmostPx);
  }
}

const pxStr = "██";
const printedWidth = width * pxStr.length;

console.log(
  `+${" Part 2 ".padStart(printedWidth / 2 + 4, "-").padEnd(printedWidth, "-")}+`,
);
image.forEach((row) => {
  console.log(
    "|" +
      row
        .map((pixel) => {
          switch (pixel) {
            case px.black:
              return styleText("black", pxStr);
            case px.white:
              return styleText("white", pxStr);
            default:
              throw new Error(`Unexpected pixel "${pixel}"`);
          }
        })
        .join("") +
      "|",
  );
});
console.log(`+${"-".repeat(printedWidth)}+`);

benchmark.print("Part 2");
benchmark.printGlobal();
