import { inputToIntcodeComputerMemory } from "../util/input.js";
import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import type { IntcodeComputerStatus } from "../intcode/types.ts";

const scoreboard = document.getElementById("score") as HTMLSpanElement;
const canvas = document.getElementById("screen") as HTMLCanvasElement;
const autopilotOnButton = document.getElementById(
  "autopilot-on",
) as HTMLButtonElement;
const autopilotOffButton = document.getElementById(
  "autopilot-off",
) as HTMLButtonElement;
const programInput = document.getElementById("program") as HTMLTextAreaElement;
const runButton = document.getElementById("run") as HTMLButtonElement;
const youWin = document.getElementById("you-win") as HTMLDivElement;

let computer: IntcodeComputer;
let computerStatus: IntcodeComputerStatus;
const pixels: number[][] = [];

let autopilot = false;
let paddleX = 0;
let ballX = 0;

autopilotOnButton.disabled = true;
autopilotOffButton.disabled = true;
youWin.classList.add("hidden");

runButton.addEventListener("click", init);
autopilotOnButton.addEventListener("click", () => {
  autopilot = true;
  doAutopilot();
  autopilotOnButton.disabled = true;
  autopilotOffButton.disabled = false;
});
autopilotOffButton.addEventListener("click", () => {
  autopilot = false;
  autopilotOnButton.disabled = false;
  autopilotOffButton.disabled = true;
});

function init() {
  const initialMemory = inputToIntcodeComputerMemory(programInput.value);
  computer = new IntcodeComputer(initialMemory);
  run();

  autopilotOnButton.disabled = false;
  autopilotOffButton.disabled = true;
  youWin.classList.add("hidden");
}

function run() {
  computerStatus = computer.run();
  let currentOutput = [];

  while (computerStatus.status === "output") {
    currentOutput.push(computerStatus.output);

    if (currentOutput.length === 3) {
      const x = currentOutput[0];
      const y = currentOutput[1];
      const value = currentOutput[2];

      if (x === -1 && y === 0) {
        scoreboard.textContent = value.toString();
      } else {
        if (!pixels[y]) {
          pixels[y] = [];
        }

        pixels[y][x] = value;
        draw(pixels);

        if (value === 3) {
          paddleX = x;
        } else if (value === 4) {
          ballX = x;
        }
      }

      currentOutput = [];
    }

    computerStatus = computer.run();
  }

  if (autopilot && computerStatus.status === "input") {
    setTimeout(doAutopilot, 5);
  }

  if (computerStatus.status === "done") {
    draw(pixels);
    youWin.classList.remove("hidden");
  }
}

addEventListener("keydown", (event: KeyboardEvent) => {
  if (
    autopilot ||
    !computer ||
    !computerStatus ||
    computerStatus.status !== "input"
  ) {
    return;
  }

  switch (event.key) {
    case "ArrowRight":
      computer.enqueueInput(1);
      run();
      break;
    case "ArrowUp":
      computer.enqueueInput(0);
      run();
      break;
    case "ArrowLeft":
      computer.enqueueInput(-1);
      run();
      break;
    default:
      break;
  }
});

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

function doAutopilot() {
  if (computerStatus.status === "input") {
    if (paddleX > ballX) {
      computer.enqueueInput(-1);
    } else if (paddleX < ballX) {
      computer.enqueueInput(1);
    } else {
      computer.enqueueInput(0);
    }

    run();
  }
}
