import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

export async function run(
  initialMemory: number[],
  {
    onScoreChange,
    onDisplayChange,
    onInput,
  }: {
    onScoreChange?: (score: number) => void;
    onDisplayChange?: (pixels: number[][]) => Promise<void>;
    onInput?: (paddleX: number, ballX: number) => Promise<-1 | 0 | 1>;
  } = {},
) {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  let currentOutput: number[] = [];

  const pixels: number[][] = [];
  let paddleX = 0;
  let paddleY = 0;
  let ballX = 0;
  let ballY = 0;
  let score = 0;

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        currentOutput.push(computerStatus.output);

        if (currentOutput.length === 3) {
          const x = currentOutput[0];
          const y = currentOutput[1];
          const value = currentOutput[2];

          if (x === -1 && y === 0) {
            onScoreChange?.(value);
            score = value;
          } else {
            if (!pixels[y]) {
              pixels[y] = [];
            }

            pixels[y][x] = value;

            if (onDisplayChange) {
              await onDisplayChange(pixels);
            }

            if (value === 3) {
              paddleX = x;
              paddleY = y;
            } else if (value === 4) {
              ballX = x;
              ballY = y;
            }
          }

          currentOutput = [];
        }

        computerStatus = computer.run();
        break;
      case "input":
        if (!onInput) {
          throw new Error("Unhandled input status");
        }

        computer.enqueueInput(await onInput(paddleX, ballX));
        computerStatus = computer.run();
        break;
    }
  }

  const state: "win" | "loss" | "tilt" =
    pixels.flatMap((pxRow) => pxRow).filter((px) => px === 2).length === 0
      ? "win"
      : ballY > paddleY
        ? "loss"
        : "tilt";

  return { pixels, score, state };
}

export function doAutopilot(paddleX: number, ballX: number): -1 | 0 | 1 {
  if (paddleX > ballX) {
    return -1;
  } else if (paddleX < ballX) {
    return 1;
  } else {
    return 0;
  }
}
