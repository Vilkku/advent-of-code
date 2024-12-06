export const part1 = (input: string) => {
  const possibleParts: {
    id: number;
    row: number;
    start: number;
    end: number;
  }[] = [];
  const symbols: Record<number, Record<number, string>> = {};

  input.split("\n").forEach((line, index) => {
    const partIdsMatch = [...line.matchAll(/[0-9]+/g)];
    const symbolsMatch = [...line.matchAll(/[^0-9\.]/g)];

    if (partIdsMatch) {
      partIdsMatch.forEach((match) => {
        if (match.index !== undefined) {
          possibleParts.push({
            id: parseInt(match[0], 10),
            row: index,
            start: match.index,
            end: match.index + match[0].length - 1,
          });
        }
      });
    }

    if (symbolsMatch) {
      symbolsMatch.forEach((match) => {
        if (!symbols[index]) {
          symbols[index] = {};
        }
        if (match.index) {
          symbols[index][match.index] = match[0];
        }
      });
    }
  });

  const parts = possibleParts.filter((part) => {
    if (symbols[part.row - 1]) {
      for (let i = part.start - 1; i <= part.end + 1; i++) {
        if (symbols[part.row - 1] && symbols[part.row - 1][i]) {
          return true;
        }
      }
    }

    if (symbols[part.row + 1]) {
      for (let i = part.start - 1; i <= part.end + 1; i++) {
        if (symbols[part.row + 1] && symbols[part.row + 1][i]) {
          return true;
        }
      }
    }

    if (symbols[part.row] && symbols[part.row][part.start - 1]) {
      return true;
    }

    if (symbols[part.row] && symbols[part.row][part.end + 1]) {
      return true;
    }
  });

  return parts.reduce((acc, part) => acc + part.id, 0);
};

export const part2 = (input: string) => {
  const partNumbers: Record<number, Record<number, number>> = {};
  const gears: [number, number][] = [];

  input.split("\n").forEach((line, index) => {
    const partIdsMatch = [...line.matchAll(/[0-9]+/g)];
    const gearsMatch = [...line.matchAll(/\*/g)];

    if (partIdsMatch) {
      partIdsMatch.forEach((match) => {
        if (!partNumbers[index]) {
          partNumbers[index] = {};
        }

        if (match.index !== undefined) {
          for (let i = match.index; i < match.index + match[0].length; i++) {
            partNumbers[index][i] = parseInt(match[0], 10);
          }
        }
      });
    }

    if (gearsMatch) {
      gearsMatch.forEach((match) => {
        if (match.index !== undefined) {
          gears.push([index, match.index]);
        }
      });
    }
  });

  return gears
    .map(([row, col]) => {
      const partIds = [];

      if (partNumbers[row - 1]) {
        for (let i = col - 1; i <= col + 1; i++) {
          if (partNumbers[row - 1] && partNumbers[row - 1][i]) {
            partIds.push(partNumbers[row - 1][i]);
          }
        }
      }

      if (partNumbers[row + 1]) {
        for (let i = col - 1; i <= col + 1; i++) {
          if (partNumbers[row + 1] && partNumbers[row + 1][i]) {
            partIds.push(partNumbers[row + 1][i]);
          }
        }
      }

      if (partNumbers[row] && partNumbers[row][col - 1]) {
        partIds.push(partNumbers[row][col - 1]);
      }

      if (partNumbers[row] && partNumbers[row][col + 1]) {
        partIds.push(partNumbers[row][col + 1]);
      }

      const uniquePartIds = [...new Set(partIds)];

      return uniquePartIds.length == 2
        ? uniquePartIds[0] * uniquePartIds[1]
        : 0;
    })
    .reduce((acc, ratio) => acc + ratio, 0);
};
