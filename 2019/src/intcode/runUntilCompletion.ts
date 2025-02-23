import { getInstructionResult, parseInstruction } from "./instruction.ts";
import type { RunStatus } from "./types.ts";
import { readFromMemory } from "./readFromMemory.ts";
import { IntcodeComputer } from "./IntcodeComputer.ts";

const OPCODE_HALT = 99;
export function run(
  initialMemory: number[],
  inputQueue: number[] = [],
  pointer = 0,
  relativeBase = 0,
): RunStatus {
  const memory = [...initialMemory];

  while (readFromMemory(memory, pointer) !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory);

    let input;
    if (instruction.type === "input") {
      // TODO inputQueue is being mutated here
      input = inputQueue.shift();

      if (typeof input === "undefined") {
        return { status: "input", memory, pointer, relativeBase };
      }
    }

    const instructionResult = getInstructionResult(
      instruction,
      memory,
      relativeBase,
      input,
    );

    switch (instructionResult.type) {
      case "update-value":
        memory[instructionResult.address] = instructionResult.value;
        pointer += instruction.parameters.length + 1;
        break;
      case "set-output":
        pointer += instruction.parameters.length + 1;
        return {
          status: "output",
          memory,
          pointer,
          output: instructionResult.value,
          relativeBase,
        };
      case "set-pointer":
        pointer = instructionResult.value;
        break;
      case "update-relative-base":
        relativeBase += instructionResult.value;
        pointer += instruction.parameters.length + 1;
        break;
      case "nothing":
        pointer += instruction.parameters.length + 1;
        break;
      default:
        return instructionResult satisfies never;
    }
  }

  return { status: "done", memory, pointer, relativeBase };
}

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
