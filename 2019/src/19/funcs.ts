import { IntcodeComputer } from "../intcode/IntcodeComputer";
import { type ImageData, type Pixel, pixels } from "../util/map.ts";

export function mapTractorBeam(
  initialMemory: number[],
  width: number,
  height: number,
): ImageData {
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    map[y] = Array(width).fill(0);
    const startY = y === 0 ? 0 : map[y - 1].indexOf(1);
    let beamEncountered = false;
    let endOfBeamReached = false;

    for (let x = startY; x < width; x++) {
      if (!endOfBeamReached) {
        const computer = new IntcodeComputer(initialMemory);
        let computerStatus = computer.run();

        while (computerStatus.status !== "done") {
          switch (computerStatus.status) {
            case "output":
              map[y][x] = computerStatus.output;

              if (!beamEncountered && computerStatus.output === 1) {
                beamEncountered = true;
              }

              if (beamEncountered && computerStatus.output === 0) {
                endOfBeamReached = true;
              }

              computerStatus = computer.run();
              break;
            case "input":
              computer.enqueueInput(x);
              computer.enqueueInput(y);
              computerStatus = computer.run();
              break;
          }
        }
      }
    }
  }

  return map;
}
