import { IntcodeComputer } from "./IntcodeComputer.ts";

export function runUntilCompletion(
  initialMemory: number[],
  input?: number,
): { memory: number[]; output: number[] } {
  const computer = new IntcodeComputer(initialMemory);

  const output: number[] = [];

  if (typeof input !== "undefined") {
    computer.enqueueInput(input);
  }

  let result = computer.run();

  while (result.status !== "done") {
    switch (result.status) {
      case "input":
        throw new Error("Computer requires more input");
      case "output":
        output.push(result.output);
        result = computer.run();
        break;
    }
  }

  return {
    memory: result.memory,
    output,
  };
}
