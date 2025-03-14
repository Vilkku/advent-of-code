import { styleText } from "node:util";

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

export function print2DArray(
  array: number[][],
  title = "",
  renderPixel: (px: number, pxStr: string) => string = defaultRenderPixel,
): void {
  const printedWidth = array[0].length * defaultPxStr.length;

  console.log(
    `+${title.padStart(printedWidth / 2 + title.length / 2, "-").padEnd(printedWidth, "-")}+`,
  );
  array.forEach((row) => {
    console.log(
      "|" + row.map((px) => renderPixel(px, defaultPxStr)).join("") + "|",
    );
  });
  console.log(`+${"-".repeat(printedWidth)}+`);
}
