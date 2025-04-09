import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

export async function run(
  initialMemory: number[],
  {
    onOutput,
    onInput,
  }: {
    onOutput: (status: number) => boolean;
    onInput: () => Promise<1 | 2 | 3 | 4>;
  },
) {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  let abort = false;

  while (computerStatus.status !== "done" && !abort) {
    switch (computerStatus.status) {
      case "output":
        abort = onOutput(computerStatus.output);
        computerStatus = computer.run();
        break;
      case "input":
        computer.enqueueInput(await onInput());
        computerStatus = computer.run();
        break;
    }
  }
}
