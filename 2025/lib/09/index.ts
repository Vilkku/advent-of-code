import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`;

function getArea(a: [number, number], b: [number, number]): number {
  return (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1);
}

printAnswer(
  "Part 1",
  () => {
    const points: [number, number][] = input
      .trim()
      .split("\n")
      .map((row) => {
        const [x, y] = row.split(",").map((n) => parseInt(n, 10));
        return [x!, y!];
      });

    const areas: number[] = [];

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        areas.push(getArea(points[i]!, points[j]!));
      }
    }

    return areas.toSorted((a, b) => b - a)[0]!;
  },
  4777824480,
);
