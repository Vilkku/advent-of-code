import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `123 328  51 64 \n 45 64  387 23 \n  6 98  215 314\n*   +   *   +  \n`;

printAnswer(
  "Part 1",
  () => {
    const numbers: number[][] = [];
    const operators: string[] = [];
    const rows = input.trim().split("\n");

    rows.forEach((row, rowIndex) => {
      if (rowIndex === rows.length - 1) {
        const cols = row.match(/([\*\+])/g);

        cols!.forEach((col, colIndex) => {
          operators[colIndex] = col;
        });
      } else {
        const cols = row.match(/([0-9]+)/g);

        cols!.forEach((col, colIndex) => {
          if (rowIndex === 0) {
            numbers[colIndex] = [];
          }

          numbers[colIndex]!.push(parseInt(col, 10));
        });
      }
    });

    if (numbers.length !== operators.length) {
      throw new Error("Length mismatch");
    }

    return numbers.reduce((sum, problemNumbers, index) => {
      switch (operators[index]) {
        case "*":
          return sum + problemNumbers.reduce((prev, curr) => prev * curr, 1);
        case "+":
          return sum + problemNumbers.reduce((prev, curr) => prev + curr, 0);
        default:
          throw new Error(`Invalid operator ${operators[index]}`);
      }
    }, 0);
  },
  6343365546996,
);

printAnswer(
  "Part 2",
  () => {
    const numbersStr: string[][] = [];
    const operators: string[] = [];
    const columnWidths: number[] = [];
    const rows = input.trim().split("\n");

    rows.forEach((row, rowIndex) => {
      if (rowIndex === rows.length - 1) {
        const cols = row.match(/([\*\+])/g);

        cols!.forEach((col, colIndex) => {
          operators[colIndex] = col;
        });
      } else {
        const cols = row.match(/([0-9]+)/g);

        cols!.forEach((col, colIndex) => {
          if (
            columnWidths[colIndex] === undefined ||
            columnWidths[colIndex] < col.length
          ) {
            columnWidths[colIndex] = col.length;
          }
        });
      }
    });

    const columns = columnWidths.map((width, colIndex) => {
      const start =
        colIndex === 0
          ? 0
          : columnWidths
              .slice(0, colIndex)
              .reduce((prev, curr) => prev + curr + 1, 0);

      return {
        start,
        end: start + width,
      };
    });

    rows.forEach((row, rowIndex) => {
      if (rowIndex !== rows.length - 1) {
        columns.forEach((col, colIndex) => {
          if (!numbersStr[colIndex]) {
            numbersStr[colIndex] = [];
          }

          numbersStr[colIndex].push(row.substring(col.start, col.end));
        });
      }
    });

    const numbers = numbersStr.map((colNumbersStr) => {
      const width = colNumbersStr[0]!.length;
      const constructedNumbers: number[] = [];

      for (let i = 0; i < width; i++) {
        const numberFromColumn = parseInt(
          colNumbersStr
            .map((numberStr) => numberStr[i])
            .join("")
            .trim(),
        );
        constructedNumbers.push(numberFromColumn);
      }

      return constructedNumbers;
    });

    if (numbers.length !== operators.length) {
      throw new Error("Length mismatch");
    }

    return numbers.reduce((sum, problemNumbers, index) => {
      switch (operators[index]) {
        case "*":
          return sum + problemNumbers.reduce((prev, curr) => prev * curr, 1);
        case "+":
          return sum + problemNumbers.reduce((prev, curr) => prev + curr, 0);
        default:
          throw new Error(`Invalid operator ${operators[index]}`);
      }
    }, 0);
  },
  11136895955912,
);
