import type { RunStatus } from "./types.ts";
import { run } from "./run.ts";

export class IntcodeComputer {
  memory: number[];
  pointer: number = 0;
  inputQueue: number[] = [];

  constructor(initialMemory: number[], initialInputs: number[]) {
    this.memory = [...initialMemory];
    this.inputQueue = [...initialInputs];
  }

  run(): RunStatus {
    const result = run(this.memory, this.inputQueue, this.pointer);

    this.memory = [...result.memory];
    this.pointer = result.pointer;

    return result;
  }
}
