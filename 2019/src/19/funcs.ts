import { IntcodeComputer } from "../intcode/IntcodeComputer";
import { type ImageData } from "../util/map.ts";

export function mapTractorBeam(
  initialMemory: number[],
  width: number,
  height: number,
): ImageData {
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    map[y] = Array(width).fill(0);
    const startX = y === 0 ? 0 : map[y - 1].indexOf(1);
    let beamEncountered = false;
    let endOfBeamReached = false;

    for (let x = startX; x < width; x++) {
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

export function mapTractorBeamAndCheckIfSantaFits(
  initialMemory: number[],
  santaWidth: number,
  santaHeight: number,
): { imageData: ImageData; santaCoords: [number, number] } {
  const map: number[][] = [];
  let y = 0;
  let santaFits = false;
  let santaCoords: [number, number] = [0, 0];

  while (!santaFits) {
    const prevRowBeamStart = y === 0 ? 0 : map[y - 1].indexOf(1);
    const startX = prevRowBeamStart === -1 ? 0 : prevRowBeamStart;
    map[y] = startX > 0 ? Array(startX).fill(0) : [];
    let x = startX;

    let beamStart = -1;
    let beamEnd = -1;

    while (beamEnd === -1) {
      const computer = new IntcodeComputer(initialMemory);
      let computerStatus = computer.run();

      // Some rows have no beam, assume beam always starts before the end of the previous row
      if (beamStart === -1 && y > 0 && x >= map[y - 1].length) {
        beamEnd = 0;
      }

      while (computerStatus.status !== "done") {
        switch (computerStatus.status) {
          case "output":
            map[y][x] = computerStatus.output;

            if (beamStart === -1 && computerStatus.output === 1) {
              beamStart = x;
            }

            if (
              beamStart !== -1 &&
              beamEnd === -1 &&
              computerStatus.output === 0
            ) {
              beamEnd = x - 1;
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

      x++;
    }

    const firstRowToCheck = y - santaHeight + 1;

    santaFits =
      beamStart !== -1 &&
      beamEnd !== -1 &&
      beamEnd - beamStart >= santaWidth - 1 &&
      firstRowToCheck >= 0 &&
      map[firstRowToCheck].length >= beamStart + santaWidth - 1 &&
      map[firstRowToCheck][beamStart] === 1 &&
      map[firstRowToCheck][beamStart + santaWidth - 1] === 1;

    if (santaFits) {
      santaCoords = [beamStart, firstRowToCheck];
    }

    y++;
  }

  return { imageData: map, santaCoords };
}
