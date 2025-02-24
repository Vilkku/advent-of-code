export function getAsteroidsInLineOfSight(
  startX: number,
  startY: number,
  map: string[][],
) {
  if (!map[startY][startX] || map[startY][startX] !== "#") {
    throw new Error(`[${startX}, ${startY}] is not an asteoroid`);
  }

  console.log(`Checking [${startX}, ${startY}]`);

  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  let distance = 1;
  while (distance <= map.length) {
    console.log(`Distance ${distance}`);

    for (const [dx, dy] of directions) {
      const x = startX + dx * distance;
      const y = startY + dy * distance;

      if (
        x < 0 ||
        y < 0 ||
        x >= map[0].length ||
        y >= map.length ||
        (x === startX && y === startY)
      ) {
        continue;
      }

      console.log(`Scanning [${x}, ${y}]`);

      if (map[y][x] === "#") {
        console.log(`Asteoroid found at [${x}, ${y}]`);
      }
    }

    distance++;
  }
}
