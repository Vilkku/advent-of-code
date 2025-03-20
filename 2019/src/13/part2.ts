import { inputToIntcodeComputerMemory } from "../util/input.js";
import { doAutopilot, run } from "./funcs.ts";

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
const youLose = document.getElementById("you-lose") as HTMLDivElement;

autopilotOnButton.disabled = true;
autopilotOffButton.disabled = true;
youWin.classList.add("hidden");
youLose.classList.add("hidden");

let autopilot = false;

function enableAutopilot() {
  autopilot = true;
  autopilotOnButton.disabled = true;
  autopilotOffButton.disabled = false;
}

function disableAutopilot() {
  autopilot = false;
  autopilotOnButton.disabled = false;
  autopilotOffButton.disabled = true;
}

autopilotOnButton.addEventListener("click", enableAutopilot);
autopilotOffButton.addEventListener("click", disableAutopilot);

runButton.addEventListener("click", async () => {
  const initialMemory = inputToIntcodeComputerMemory(programInput.value);

  disableAutopilot();
  youWin.classList.add("hidden");
  youLose.classList.add("hidden");
  scoreboard.textContent = "0";

  const { state } = await run(initialMemory, {
    onScoreChange: (score) => {
      scoreboard.textContent = score.toString();
    },
    onDisplayChange: (pixels): Promise<void> => {
      return new Promise((resolve) =>
        setTimeout(() => {
          draw(pixels);
          resolve();
        }, 1),
      );
    },
    onInput: (paddleX, ballX): Promise<-1 | 0 | 1> => {
      if (autopilot) {
        return new Promise((resolve) => resolve(doAutopilot(paddleX, ballX)));
      } else {
        return new Promise((resolve) => {
          addEventListener("keydown", handleArrowKey);
          autopilotOnButton.addEventListener("click", handleAutopilotButton);

          function handleArrowKey(event: KeyboardEvent) {
            const key = event.key;

            if (["ArrowRight", "ArrowUp", "ArrowLeft"].includes(key)) {
              removeEventListener("keydown", handleArrowKey);

              switch (key) {
                case "ArrowRight":
                  resolve(1);
                  break;
                case "ArrowUp":
                  resolve(0);
                  break;
                case "ArrowLeft":
                  resolve(-1);
                  break;
              }
            }
          }

          function handleAutopilotButton() {
            autopilotOnButton.removeEventListener(
              "click",
              handleAutopilotButton,
            );
            enableAutopilot();
            resolve(doAutopilot(paddleX, ballX));
          }
        });
      }
    },
  });

  if (state === "win") {
    youWin.classList.remove("hidden");
  } else if (state === "loss") {
    youLose.classList.remove("hidden");
  }

  autopilotOnButton.disabled = true;
  autopilotOffButton.disabled = true;
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
