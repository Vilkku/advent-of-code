import { inputToStrings, toInt } from "../util/input";

type Coordinate = [number, number];
interface Line {
  start: Coordinate;
  end: Coordinate;
  stepsFromOriginToStart: number;
}
export interface Path {
  horizontal: Record<string, Line[]>;
  vertical: Record<string, Line[]>;
}
interface Intersection {
  coordinate: Coordinate;
  steps: number;
}

export const inputRowToInstructions = (row: string): [string, number][] =>
  inputToStrings(row).map((s): [string, number] => {
    const direction = s.substring(0, 1);
    const distance = toInt(s.substring(1));

    return [direction, distance];
  });

export const instructionsToPath = (instructions: [string, number][]): Path => {
  const horizontal: Record<string, Line[]> = {};
  const vertical: Record<string, Line[]> = {};
  let x = 0;
  let y = 0;
  let stepsFromOriginToStart = 0;

  instructions.map(([direction, distance]) => {
    const start: Coordinate = [x, y];

    switch (direction) {
      case "U":
        y += distance;
        break;
      case "D":
        y -= distance;
        break;
      case "R":
        x += distance;
        break;
      case "L":
        x -= distance;
        break;
      default:
        throw new Error(`Unknown direction ${direction}`);
    }

    const end: Coordinate = [x, y];

    const line: Line = {
      start,
      end,
      stepsFromOriginToStart,
    };

    switch (direction) {
      case "U":
      case "D":
        if (!vertical[x]) {
          vertical[x] = [];
        }

        vertical[x].push(line);
        break;
      case "R":
      case "L":
        if (!horizontal[y]) {
          horizontal[y] = [];
        }

        horizontal[y].push(line);
        break;
      default:
        throw new Error(`Unknown direction ${direction}`);
    }

    stepsFromOriginToStart += distance;
  });

  return { horizontal, vertical };
};

export const findIntersections = (path1: Path, path2: Path): Intersection[] => {
  const intersections: Intersection[] = [];

  [
    [path1.horizontal, path2.vertical],
    [path2.horizontal, path1.vertical],
  ].forEach(([horizontal, vertical]) => {
    Object.entries(horizontal).forEach(([yStr, hLines]) => {
      const y = parseInt(yStr, 10);

      hLines.forEach(
        ({
          start: [hStartX, _hStartY],
          end: [hEndX, _hEndY],
          stepsFromOriginToStart: hLineStepsFromOriginToStart,
        }) => {
          const startX = Math.min(hStartX, hEndX);
          const endX = Math.max(hStartX, hEndX);

          Object.entries(vertical).forEach(([xStr, vLines]) => {
            const x = parseInt(xStr, 10);

            if (x === 0 && y === 0) {
              return;
            }

            vLines.forEach(
              ({
                start: [_vStartX, vStartY],
                end: [_vEndX, vEndY],
                stepsFromOriginToStart: vLineStepsFromOriginToStart,
              }) => {
                const startY = Math.min(vStartY, vEndY);
                const endY = Math.max(vStartY, vEndY);

                if (x >= startX && x <= endX && y >= startY && y <= endY) {
                  const hLineSteps =
                    hLineStepsFromOriginToStart + Math.abs(hStartX - x);
                  const vLineSteps =
                    vLineStepsFromOriginToStart + Math.abs(vStartY - y);

                  intersections.push({
                    coordinate: [x, y],
                    steps: hLineSteps + vLineSteps,
                  });
                }
              },
            );
          });
        },
      );
    });
  });

  return intersections;
};

export const getClosestDistance = (intersections: Intersection[]): number =>
  intersections
    .map(({ coordinate }) => Math.abs(coordinate[0]) + Math.abs(coordinate[1]))
    .sort((a, b) => a - b)[0];

export const getFewestSteps = (intersections: Intersection[]): number =>
  intersections.sort((a, b) => a.steps - b.steps)[0].steps;
