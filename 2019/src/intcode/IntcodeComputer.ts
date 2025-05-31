import type { IntcodeComputerStatus } from "./types.ts";
import { readFromMemory } from "./readFromMemory.ts";
import {
  getInputInstructionResult,
  getInstructionResult,
  parseInstruction,
} from "./instruction.ts";

export class IntcodeComputer {
  memory: number[];
  pointer: number = 0;
  relativeBase: number = 0;
  private inputQueue: number[] = [];
  outputs: number[] = [];
  debug = false;

  constructor(initialMemory: number[]) {
    this.memory = [...initialMemory];
  }

  run(): IntcodeComputerStatus {
    const OPCODE_HALT = 99;

    while (readFromMemory(this.memory, this.pointer) !== OPCODE_HALT) {
      const instruction = parseInstruction(this.pointer, this.memory);

      if (instruction.type === "input") {
        this.log("Input instruction");
        this.log("Input queue contains", this.inputQueue);
        this.log(
          `Calling getInputInstructionResult() with input ${this.inputQueue[0]}`,
        );
      }

      const instructionResult =
        instruction.type === "input"
          ? getInputInstructionResult(
              instruction,
              this.relativeBase,
              this.inputQueue.shift(),
            )
          : getInstructionResult(instruction, this.memory, this.relativeBase);

      if (instruction.type === "input") {
        this.log("Input queue now contains", this.inputQueue);
      }

      this.log(instructionResult.type);

      switch (instructionResult.type) {
        case "update-value":
          this.memory[instructionResult.address] = instructionResult.value;
          this.pointer += instruction.parameters.length + 1;
          break;
        case "request-input":
          return {
            status: "input",
          };
        case "set-output":
          this.pointer += instruction.parameters.length + 1;
          this.outputs.push(instructionResult.value);
          return {
            status: "output",
            output: instructionResult.value,
          };
        case "set-pointer":
          this.pointer = instructionResult.value;
          break;
        case "update-relative-base":
          this.relativeBase += instructionResult.value;
          this.pointer += instruction.parameters.length + 1;
          break;
        case "nothing":
          this.pointer += instruction.parameters.length + 1;
          break;
        default:
          return instructionResult satisfies never;
      }
    }

    return {
      status: "done",
    };
  }

  enqueueInput(input: number): void {
    this.inputQueue.push(input);
  }

  static createAndRun(
    initialMemory: number[],
    input?: number,
  ): IntcodeComputer {
    const computer = new IntcodeComputer(initialMemory);

    if (typeof input !== "undefined") {
      computer.enqueueInput(input);
    }

    let result = computer.run();

    while (result.status !== "done") {
      switch (result.status) {
        case "input":
          throw new Error("Computer requires more input");
        case "output":
          result = computer.run();
          break;
      }
    }

    return computer;
  }

  private log(...data: any[]) {
    if (this.debug) {
      console.log(...data);
    }
  }
}
