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

export function createIntcodeComputersWithNAT(initialMemory: number[]) {
  const computers = Array(50)
    .fill(undefined)
    .map((_, i) => {
      const computer = new IntcodeComputer(initialMemory);
      computer.enqueueInput(i);
      return computer;
    });

  let running = true;
  let answer = 0;
  let nat: [number, number] | undefined = undefined;
  const natPacketCounts: Record<string, number> = {};
  let i = 0;

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
          nat = [x, y];
        } else {
          computers[destination].enqueueInput(x);
          computers[destination].enqueueInput(y);
        }
      }
    });

    i++;

    if (
      computers.every(
        (computer) =>
          i > 1 && // Would be cool to get rid of this check but it works so
          (computer.inputQueue.length === 0 ||
            computer.inputQueue.every((val) => val === -1)),
      )
    ) {
      if (!nat) {
        throw new Error(`${i}: NAT empty`);
      }

      const key = `${nat[0]},${nat[1]}`;

      if (!natPacketCounts[key]) {
        natPacketCounts[key] = 0;
      }

      natPacketCounts[key]++;

      if (natPacketCounts[key] >= 2) {
        answer = nat[1];
        running = false;
      } else {
        computers[0].enqueueInput(nat[0]);
        computers[0].enqueueInput(nat[1]);
        nat = undefined;
      }
    }
  }

  return answer;
}
