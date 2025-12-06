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
    const rows: string[][] = input
      .trim()
      .split("\n")
      .map((row) => row.split(""));
    const maxCols = Math.max(...rows.map((r) => r.length), 0);

    const numbers: number[][] = [];
    const operators: string[] = [];

    let currentProblemNumbers: number[] = [];
    for (let i = 0; i < maxCols; i++) {
      const colStr = rows.map((r) => r[i] ?? " ").join("");

      if (colStr.trim() === "") {
        if (currentProblemNumbers.length > 0) {
          numbers.push([...currentProblemNumbers]);
          currentProblemNumbers = [];
        }

        continue;
      }

      const operator = colStr[colStr.length - 1];

      if (operator !== " ") {
        operators.push(operator!);
      }

      const number = parseInt(colStr.slice(0, -1).trim(), 10);
      currentProblemNumbers.push(number);
    }

    if (currentProblemNumbers.length > 0) {
      numbers.push([...currentProblemNumbers]);
    }

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
