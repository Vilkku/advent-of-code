import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
const multiRotationExampleInput = `R1000`;

function parseRotations(input: string): number[] {
  return input
    .trim()
    .split("\n")
    .map((row) => {
      const direction = row.substring(0, 1);
      const clicks = parseInt(row.substring(1), 10);

      if (direction === "L") {
        return -1 * clicks;
      }

      return clicks;
    });
}

printAnswer(
  "Part 1",
  () => {
    const rotations = parseRotations(input);
    let position = 50;
    let timesAtZero = 0;

    rotations.forEach((rotation) => {
      position = (((position + rotation) % 100) + 100) % 100;

      if (position === 0) {
        timesAtZero++;
      }
    });

    return timesAtZero;
  },
  1076,
);

printAnswer(
  "Part 2",
  () => {
    const rotations = parseRotations(input);
    let position = 50;
    let timesAtZero = 0;

    rotations.forEach((rotation) => {
      const start = position;
      const end = position + rotation;
      const absolutePosition = ((end % 100) + 100) % 100;

      let crossings = 0;
      if (rotation > 0) {
        crossings = Math.floor(end / 100);
      } else if (rotation < 0) {
        crossings = Math.floor((start - 1) / 100) - Math.floor((end - 1) / 100);
      }

      timesAtZero += Math.max(0, crossings);

      position = absolutePosition;
    });

    return timesAtZero;
  },
  6379,
);
