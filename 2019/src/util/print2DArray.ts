import { styleText } from "node:util";

const px = {
  black: 0,
  white: 1,
} as const;

export function print2DArray(array: Array<Array<unknown>>, title = ""): void {
  const pxStr = "██";
  const printedWidth = array[0].length * pxStr.length;

  console.log(
    `+${title.padStart(printedWidth / 2 + title.length / 2, "-").padEnd(printedWidth, "-")}+`,
  );
  array.forEach((row) => {
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
}
