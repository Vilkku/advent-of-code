import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

export function createIntcodeComputers(initialMemory: number[]) {
  const computers = Array(50)
    .fill(undefined)
    .map((_, i) => {
      const computer = new IntcodeComputer(initialMemory);
      computer.enqueueInput(i);
      return computer;
    });

  let running = true;
  let answer = 0;

  while (running) {
    computers.forEach((computer) => {
      let computerStatus = computer.run();
      let outputs: number[] = [];
      let done = false;

      while (!done) {
        switch (computerStatus.status) {
          case "input":
            computer.enqueueInput(-1);
            done = true;
            break;
          case "output":
            outputs.push(computerStatus.output);
            if (outputs.length === 3) {
              done = true;
            } else {
              computerStatus = computer.run();
            }
            break;
          case "done":
            throw new Error("Unexpected done status");
        }
      }

      if (outputs.length > 0) {
        const [destination, x, y] = outputs;

        if (destination === 255) {
          running = false;
          answer = y;
        } else {
          computers[destination].enqueueInput(x);
          computers[destination].enqueueInput(y);
        }
      }
    });
  }

  return answer;
}
