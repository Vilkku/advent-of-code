import { IntcodeComputer } from "../intcode/IntcodeComputer";
import { type ImageData, type Pixel, pixels } from "../util/map.ts";

export function mapTractorBeam(
  initialMemory: number[],
  width: number,
  height: number,
): ImageData {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  let x = 0;
  let y = 0;
  const map: number[][] = [];

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        if (!map[y]) {
          map[y] = [];
        }

        map[y][x] = computerStatus.output;

        console.log(`Output: ${x},${y}: ${computerStatus.output}`);

        if (x === width - 1) {
          x = 0;
          y++;
        } else {
          x++;
        }

        if (y === height) {
          return map;
        }

        computerStatus = computer.run();
        break;
      case "input":
        console.log(`Input: ${x},${y}`);
        computer.enqueueInput(x);
        computer.enqueueInput(y);
        computerStatus = computer.run();
        break;
    }
  }

  throw new Error("Unexpected done status");
}
