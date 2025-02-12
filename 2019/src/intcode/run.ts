import { getInstructionResult, parseInstruction } from "./instruction.ts";
import type { RunStatus } from "./types.ts";

const OPCODE_HALT = 99;
export function run(
  initialMemory: number[],
  initialInputQueue: number[] = [],
  pointer = 0,
): RunStatus {
  const memory = [...initialMemory];
  const inputQueue = [...initialInputQueue];

  while (memory[pointer] !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory);

    let input;
    if (instruction.type === "input") {
      if (inputQueue.length === 0) {
        return { status: "input", memory, pointer };
      } else {
        input = inputQueue.shift();
      }
    }

    const instructionResult = getInstructionResult(instruction, memory, input);

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
        };
      case "nothing":
        pointer += instruction.parameters.length + 1;
        break;
      case "set-pointer":
        pointer = instructionResult.value;
        break;
      default:
        throw new Error("Unknown instruction");
    }
  }

  return { status: "done", memory, pointer };
}

export function runUntilCompletion(
  initialMemory: number[],
  input?: number,
): { memory: number[]; output: number[] } {
  const output: number[] = [];
  const inputArray = typeof input !== "undefined" ? [input] : [];

  let result = run(initialMemory, inputArray);

  while (result.status !== "done") {
    switch (result.status) {
      case "input":
        result = run(result.memory, inputArray, result.pointer);
        break;
      case "output":
        output.push(result.output);
        result = run(result.memory, inputArray, result.pointer);
        break;
    }
  }

  return {
    memory: result.memory,
    output,
  };
}
