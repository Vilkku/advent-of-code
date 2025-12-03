import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `
987654321111111
811111111111119
234234234234278
818181911112111
`;

function parseBatteries(input: string): number[][] {
  return input
    .trim()
    .split("\n")
    .map((row) => row.split("").map((i) => parseInt(i, 10)));
}

printAnswer(
  "Part 1",
  () => {
    const batteries = parseBatteries(input);

    return batteries.reduce((output, bank) => {
      const sortedBank = bank.toSorted((a, b) => b - a);

      let firstBatteryIndex = bank.indexOf(sortedBank[0]!);
      if (firstBatteryIndex === bank.length - 1) {
        firstBatteryIndex = bank.indexOf(sortedBank[1]!);
      }

      const sortedRestOfBank = bank
        .slice(firstBatteryIndex + 1)
        .sort((a, b) => b - a);

      return (
        output +
        parseInt(`${bank[firstBatteryIndex]}${sortedRestOfBank[0]}`, 10)
      );
    }, 0);
  },
  17452,
);

printAnswer(
  "Part 2",
  () => {
    const batteries = parseBatteries(input);
    const batteriesNeeded = 12;

    return batteries.reduce((output, bank) => {
      const selectedBatteries: number[] = [];
      let lastCandidateIndex = -1;

      for (let i = batteriesNeeded; i >= 1; i--) {
        const startIndex = lastCandidateIndex + 1;
        const endIndex = bank.length - i + 1;

        const candidateBatteries = bank.slice(startIndex, endIndex);

        const sortedCandidates = candidateBatteries.toSorted((a, b) => b - a);
        const bestBattery = sortedCandidates[0]!;

        lastCandidateIndex =
          startIndex + candidateBatteries.indexOf(bestBattery);
        selectedBatteries.push(bestBattery);
      }

      return output + parseInt(`${selectedBatteries.join("")}`, 10);
    }, 0);
  },
  173300819005913,
);
