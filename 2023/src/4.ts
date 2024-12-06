export const part1 = (input: string) =>
  input
    .split("\n")
    .map((line) => {
      const match = line.match(/Card\s+[0-9]+:\s+([0-9 ]+)\s+\|\s+([0-9 ]+)/);

      if (match && match[1] && match[2]) {
        const cardNumbers = match[1]
          .trim()
          .split(/\s+/)
          .map((n) => parseInt(n, 10));
        const winningNumbers = match[2]
          .trim()
          .split(/\s+/)
          .map((n) => parseInt(n, 10));

        const winningNumbersOnCard = cardNumbers.filter((n) =>
          winningNumbers.includes(n)
        );

        const points =
          winningNumbersOnCard.length > 1
            ? Math.pow(2, winningNumbersOnCard.length - 1)
            : winningNumbersOnCard.length;

        return points;
      }

      return 0;
    })
    .reduce((acc, score) => acc + score, 0);

export const part2 = (input: string) => {
  const cards: number[] = [];

  input.split("\n").forEach((line, row) => {
    const match = line.match(/Card\s+[0-9]+:\s+([0-9 ]+)\s+\|\s+([0-9 ]+)/);

    if (match && match[1] && match[2]) {
      if (!cards[row]) {
        cards[row] = 1;
      } else {
        cards[row]++;
      }

      const cardNumbers = match[1]
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10));
      const winningNumbers = match[2]
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10));

      const winningNumbersOnCard = cardNumbers.filter((n) =>
        winningNumbers.includes(n)
      );

      winningNumbersOnCard.forEach((n, index) => {
        const nextRow = row + index + 1;
        if (!cards[nextRow]) {
          cards[nextRow] = cards[row];
        } else {
          cards[nextRow] += cards[row];
        }
      });
    }
  });

  return cards.reduce((acc, num) => acc + num, 0);
};
