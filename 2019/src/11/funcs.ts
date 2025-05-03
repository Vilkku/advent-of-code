import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { type Map, pixels } from "../util/map.ts";

export function paintSquares(
  initialMemory: number[],
  startingSquare: 0 | 1,
): Map {
  const map: Map = {};
  const computer = new IntcodeComputer(initialMemory);

  let x = 0;
  let y = 0;
  let direction: "up" | "right" | "down" | "left" = "up";
  let lastOutputType: "paint" | "turn" = "turn";

  computer.enqueueInput(startingSquare);
  let computerStatus = computer.run();

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        if (lastOutputType === "turn") {
          lastOutputType = "paint";

          if (!map[y]) {
            map[y] = {};
          }

          switch (computerStatus.output) {
            case 0:
              map[y][x] = pixels.black;
              break;
            case 1:
              map[y][x] = pixels.white;
              break;
            default:
              throw new Error(
                `Unexpected output "${computerStatus.output}" for painting`,
              );
          }
        } else {
          lastOutputType = "turn";

          switch (computerStatus.output) {
            case 0:
              switch (direction) {
                case "up":
                  direction = "left";
                  break;
                case "right":
                  direction = "up";
                  break;
                case "down":
                  direction = "right";
                  break;
                case "left":
                  direction = "down";
                  break;
              }
              break;
            case 1:
              switch (direction) {
                case "up":
                  direction = "right";
                  break;
                case "right":
                  direction = "down";
                  break;
                case "down":
                  direction = "left";
                  break;
                case "left":
                  direction = "up";
                  break;
              }
              break;
            default:
              throw new Error(
                `Unexpected output "${computerStatus.output}" for turning`,
              );
          }

          // Top-left corner is 0,0, Y grows downward
          switch (direction) {
            case "up":
              y--;
              break;
            case "right":
              x++;
              break;
            case "down":
              y++;
              break;
            case "left":
              x--;
              break;
          }
        }

        computerStatus = computer.run();
        break;
      case "input":
        computer.enqueueInput(map[y]?.[x] === "white" ? 1 : 0);
        computerStatus = computer.run();
        break;
    }
  }

  return map;
}
