import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { print2DArray } from "../util/print2DArray.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const computer = new IntcodeComputer(initialMemory);

let computerStatus = computer.run();
let currentOutput = [];
const pixels: number[][] = [];

while (computerStatus.status !== "done") {
  switch (computerStatus.status) {
    case "output":
      currentOutput.push(computerStatus.output);

      if (currentOutput.length === 3) {
        const x = currentOutput[0];
        const y = currentOutput[1];
        const value = currentOutput[2];

        if (!pixels[y]) {
          pixels[y] = [];
        }

        pixels[y][x] = value;

        currentOutput = [];
      }
      break;
    default:
      throw new Error(`Unexpected status ${computerStatus.status}`);
  }

  computerStatus = computer.run();
}

const part1Answer = pixels.flatMap((pxRow) => pxRow).filter((px) => px === 2);

console.log("Part 1", part1Answer.length);

print2DArray(pixels, "Part 1", (px: number, pxStr: string) => {
  switch (px) {
    case 0:
      return " ".repeat(pxStr.length);
    case 1:
      return "W".repeat(pxStr.length);
    case 2:
      return "B".repeat(pxStr.length);
    case 3:
      return "P".repeat(pxStr.length);
    case 4:
      return "O".repeat(pxStr.length);
    default:
      throw new Error(`Unexpected pixel ${px}`);
  }
});
