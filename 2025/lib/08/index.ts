import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`;

type Coordinate = {
  x: number;
  y: number;
  z: number;
};

function parseCoordinate(coordinate: string): Coordinate {
  const [xStr, yStr, zStr] = coordinate.split(",");

  return {
    x: parseInt(xStr!, 10),
    y: parseInt(yStr!, 10),
    z: parseInt(zStr!, 10),
  };
}

function getKey(coordinate: Coordinate): string {
  return `${coordinate.x},${coordinate.y},${coordinate.z}`;
}

function getDistance(a: Coordinate, b: Coordinate): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function parseDistances(input: string): Map<string, number> {
  const coordinates = input.trim().split("\n");
  const distances: Map<string, number> = new Map();

  for (const key of coordinates) {
    const coordinate = parseCoordinate(key);

    for (const compareKey of coordinates) {
      if (key === compareKey) {
        continue;
      }

      const compareCoordinate = parseCoordinate(compareKey);

      const [a, b] = [coordinate, compareCoordinate].sort(
        (a, b) => a.x - b.x || a.y - b.y || a.z - b.z,
      ) as [Coordinate, Coordinate];

      const distanceKey = `${getKey(a)}-${getKey(b)}`;

      if (distances.has(distanceKey)) {
        continue;
      }

      const distance = getDistance(a, b);
      distances.set(distanceKey, distance);
    }
  }

  return new Map(
    [...distances].sort(
      ([_aKey, aDistance], [_bKey, bDistance]) => aDistance - bDistance,
    ),
  );
}

printAnswer(
  "Part 1",
  () => {
    const distances = parseDistances(input);
    const distanceKeys = [...distances.keys()];
    let circuits: Set<string>[] = [];

    let connections = 0;
    while (connections < 1000 && distanceKeys.length > 0) {
      connections++;

      const shortestDistanceKey = distanceKeys.shift()!;
      const [aKey, bKey] = shortestDistanceKey.split("-");

      const aCircuit = circuits.find((circuit) => circuit.has(aKey!));
      const bCircuit = circuits.find((circuit) => circuit.has(bKey!));

      if (!aCircuit && !bCircuit) {
        circuits.push(new Set([aKey!, bKey!]));
      } else if (aCircuit === bCircuit) {
        // Already connected
        continue;
      } else if (aCircuit && !bCircuit) {
        aCircuit.add(bKey!);
      } else if (bCircuit && !aCircuit) {
        bCircuit.add(aKey!);
      } else if (aCircuit && bCircuit) {
        circuits = circuits.filter(
          (circuit) => circuit !== aCircuit && circuit !== bCircuit,
        );
        circuits.push(new Set([...aCircuit, ...bCircuit]));
      }
    }

    const circuitSizes = [...circuits]
      .map((circuit) => circuit.size)
      .sort((a, b) => b - a);

    return circuitSizes[0]! * circuitSizes[1]! * circuitSizes[2]!;
  },
  123234,
);

printAnswer(
  "Part 2",
  () => {
    const distances = parseDistances(input);
    const distanceKeys = [...distances.keys()];
    let circuits: Set<string>[] = [];

    for (const distanceKey of distanceKeys) {
      const [aKey, bKey] = distanceKey.split("-");

      const aCircuit = circuits.find((circuit) => circuit.has(aKey!));
      const bCircuit = circuits.find((circuit) => circuit.has(bKey!));

      if (!aCircuit) {
        circuits.push(new Set([aKey!]));
      }

      if (!bCircuit) {
        circuits.push(new Set([bKey!]));
      }
    }

    let shortestDistanceKey: string | undefined = undefined;

    while (circuits.length > 1) {
      shortestDistanceKey = distanceKeys.shift()!;
      const [aKey, bKey] = shortestDistanceKey.split("-");

      const aCircuit = circuits.find((circuit) => circuit.has(aKey!));
      const bCircuit = circuits.find((circuit) => circuit.has(bKey!));

      if (!aCircuit || !bCircuit) {
        throw new Error("Could not find either circuit");
      } else if (aCircuit === bCircuit) {
        // Already connected
        continue;
      } else {
        circuits = circuits.filter(
          (circuit) => circuit !== aCircuit && circuit !== bCircuit,
        );
        circuits.push(new Set([...aCircuit, ...bCircuit]));
      }
    }

    const [aKey, bKey] = shortestDistanceKey!.split("-");
    const a = parseCoordinate(aKey!);
    const b = parseCoordinate(bKey!);

    return a.x * b.x;
  },
  9259958565,
);
