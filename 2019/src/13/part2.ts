import { inputToIntcodeComputerMemory } from "../util/input.js";
import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

document.getElementById("run")?.addEventListener("click", run);
const canvas = document.getElementById("screen") as HTMLCanvasElement;

function run() {
  const initialMemory = inputToIntcodeComputerMemory(
    (document.getElementById("program") as HTMLTextAreaElement).value,
  );

  const computer = new IntcodeComputer(initialMemory);

  let computerStatus = computer.run();
  let currentOutput = [];
  const pixels: number[][] = [];

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        currentOutput.push(computerStatus.output);

        if (currentOutput.length === 3) {
          const x = currentOutput[0];
          const y = currentOutput[1];
          const value = currentOutput[2];

          if (!pixels[y]) {
            pixels[y] = [];
          }

          pixels[y][x] = value;

          currentOutput = [];
        }
        break;
      default:
        throw new Error(`Unexpected status ${computerStatus.status}`);
    }

    computerStatus = computer.run();
  }

  draw(pixels);
}

function draw(pixels: number[][]) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const scale = 30;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = pixels[0]?.length ?? 0;
  const height = pixels.length;

  canvas.width = width * scale;
  canvas.height = height * scale;

  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  pixels.forEach((row, y) => {
    row.forEach((px, x) => {
      switch (px) {
        case 0:
          ctx.fillStyle = "#fff";
          break;
        case 1:
          ctx.fillStyle = "#000";
          break;
        case 2:
          ctx.fillStyle = "#00f";
          break;
        case 3:
          ctx.fillStyle = "#0f0";
          break;
        case 4:
          ctx.fillStyle = "#f00";
          break;
      }

      ctx.fillRect(x, y, 1, 1);
    });
  });

  ctx.save();
}
