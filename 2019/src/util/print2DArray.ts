import { styleText } from "node:util";
import { toInt } from "./input";

const defaultPxStr = "██";

function defaultRenderPixel(pixel: number, pxStr: string) {
  const px = {
    black: 0,
    white: 1,
  } as const;

  switch (pixel) {
    case px.black:
      return styleText("black", pxStr);
    case px.white:
      return styleText("white", pxStr);
    default:
      throw new Error(`Unexpected pixel "${pixel}"`);
  }
}

export function getSmallestAndLargestKeysInRecord(
  record: Record<number, unknown>,
): { min: number; max: number } {
  // Keys are actually strings so need to use a custom sort function
  const sortedKeys = [...Object.keys(record)].map(toInt).sort((a, b) => a - b);

  return {
    min: sortedKeys.at(0) ?? 0,
    max: sortedKeys.at(-1) ?? 0,
  };
}

export function print2DArray(
  array: number[][],
  title = "",
  renderPixel: (px: number, pxStr: string) => string = defaultRenderPixel,
  pxStr = defaultPxStr,
): void {
  const printedWidth = array[0].length * pxStr.length;

  console.log(
    `+${title.padStart(printedWidth / 2 + title.length / 2, "-").padEnd(printedWidth, "-")}+`,
  );
  array.forEach((row) => {
    console.log("|" + row.map((px) => renderPixel(px, pxStr)).join("") + "|");
  });
  console.log(`+${"-".repeat(printedWidth)}+`);
}
