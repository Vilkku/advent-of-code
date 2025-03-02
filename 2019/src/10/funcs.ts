type SlopeMap = Map<number, [number, number][]>;

function getAsteroidSlopes(
  asteroidX: number,
  asteroidY: number,
  map: string[][],
): {
  leftSlopes: SlopeMap;
  rightSlopes: SlopeMap;
} {
  if (!map[asteroidY][asteroidX] || map[asteroidY][asteroidX] !== "#") {
    throw new Error("Not an asteroid");
  }

  const leftSlopes: SlopeMap = new Map();
  const rightSlopes: SlopeMap = new Map();
  map.forEach((row, y) =>
    row.forEach((point, x) => {
      if (point === "#" && !(asteroidX === x && asteroidY === y)) {
        const slope = (y - asteroidY) / (x - asteroidX);
        const slopesMap = x < asteroidX ? leftSlopes : rightSlopes;

        if (!slopesMap.has(slope)) {
          slopesMap.set(slope, []);
        }

        slopesMap.get(slope)!.push([x, y]);
      }
    }),
  );

  const getDistance = ([x, y]: [number, number]): number =>
    Math.abs(x - asteroidX) + Math.abs(y - asteroidY);

  leftSlopes
    .values()
    .forEach((coords) =>
      coords.sort((a, b) => getDistance(a) - getDistance(b)),
    );

  rightSlopes
    .values()
    .forEach((coords) =>
      coords.sort((a, b) => getDistance(a) - getDistance(b)),
    );

  return { leftSlopes, rightSlopes };
}

export function getAsteroidsInLineOfSight(
  x: number,
  y: number,
  map: string[][],
): number {
  const { leftSlopes, rightSlopes } = getAsteroidSlopes(x, y, map);

  return leftSlopes.size + rightSlopes.size;
}

export function getSuitableLocationForBase(map: string[][]): {
  coordinate: [number, number];
  asteroidsInLineOfSight: number;
} {
  const asteroidsInLineOfSight = map
    .flatMap((row, y) =>
      row.map((point, x) =>
        point === "#"
          ? {
              coordinate: [x, y] as [number, number],
              asteroidsInLineOfSight: getAsteroidsInLineOfSight(x, y, map),
            }
          : undefined,
      ),
    )
    .filter((val) => val !== undefined)
    .sort((a, b) => b.asteroidsInLineOfSight - a.asteroidsInLineOfSight);

  return asteroidsInLineOfSight[0];
}

export function executeCompleteVaporizationByGiantLaser(
  [x, y]: [number, number],
  map: string[][],
): [number, number][] {
  const { leftSlopes, rightSlopes } = getAsteroidSlopes(x, y, map);

  const rightSlopeKeysInOrder = [...rightSlopes.keys()].sort((a, b) => a - b);
  const leftSlopeKeysInOrder = [...leftSlopes.keys()].sort((a, b) => a - b);
  const blastedAsteroids: [number, number][] = [];

  const vaporizationComplete = () =>
    rightSlopes.values().every((value) => value.length === 0) &&
    leftSlopes.values().every((value) => value.length === 0);

  while (!vaporizationComplete()) {
    rightSlopeKeysInOrder.forEach((key) => {
      const coordinate = rightSlopes.get(key)!.shift();
      if (coordinate) {
        blastedAsteroids.push(coordinate);
      }
    });

    leftSlopeKeysInOrder.forEach((key) => {
      const coordinate = leftSlopes.get(key)!.shift();
      if (coordinate) {
        blastedAsteroids.push(coordinate);
      }
    });
  }

  return blastedAsteroids;
}
