import type { RunStatus } from "./types.ts";
import { run } from "./run.ts";

export class IntcodeComputer {
  memory: number[];
  pointer: number = 0;
  private inputQueue: number[] = [];

  constructor(initialMemory: number[]) {
    this.memory = [...initialMemory];
  }

  run(): RunStatus {
    const result = run(this.memory, this.inputQueue, this.pointer);

    this.memory = [...result.memory];
    this.pointer = result.pointer;

    return result;
  }

  enqueueInput(input: number): void {
    this.inputQueue.push(input);
  }
}
