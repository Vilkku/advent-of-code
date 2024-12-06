export const part1 = (input: string) => {
  const limit: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const possibleGames = input
    .split("\n")
    .map((line) => {
      const gameIdMatch = line.match(/Game ([0-9]+):/);
      const colorsMatch = line.matchAll(/([0-9]+) (blue|red|green)/g);
      if (!gameIdMatch || !colorsMatch) {
        return null;
      }

      const gameId = parseInt(gameIdMatch[1], 10);

      const possible = [...colorsMatch].every((match) => {
        const color = match[2];
        const amount = parseInt(match[1], 10);

        return !!limit[color] && limit[color] >= amount;
      });

      return possible ? gameId : null;
    })
    .filter((gameId): gameId is number => gameId !== null);

  return possibleGames.reduce((acc, line) => acc + line, 0);
};

export const part2 = (input: string) => {
  const powers = input
    .split("\n")
    .map((line) => {
      const colorsMatch = line.matchAll(/([0-9]+) (blue|red|green)/g);
      if (!colorsMatch) {
        return null;
      }

      const amounts: Record<string, number> = {
        red: 0,
        green: 0,
        blue: 0,
      };

      [...colorsMatch].forEach((match) => {
        const color = match[2];
        const amount = parseInt(match[1], 10);

        if (!amounts[color] || amount > amounts[color]) {
          amounts[color] = amount;
        }
      });

      return amounts.red * amounts.green * amounts.blue;
    })
    .filter((power): power is number => power !== null);

  return powers.reduce((acc, line) => acc + line, 0);
};
