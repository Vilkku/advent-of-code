import type { RunStatus } from "./types.ts";
import { run } from "./runUntilCompletion.ts";

export class IntcodeComputer {
  memory: number[];
  pointer: number = 0;
  relativeBase: number = 0;
  private inputQueue: number[] = [];
  outputs: number[] = [];

  constructor(initialMemory: number[]) {
    this.memory = [...initialMemory];
  }

  run(): RunStatus {
    const result = run(
      this.memory,
      this.inputQueue,
      this.pointer,
      this.relativeBase,
    );

    this.memory = [...result.memory];
    this.pointer = result.pointer;
    this.relativeBase = result.relativeBase;

    return result;
  }

  enqueueInput(input: number): void {
    this.inputQueue.push(input);
  }
}
