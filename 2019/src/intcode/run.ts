import { getInstructionResult, parseInstruction } from "./instruction.ts";
import type { RunStatus } from "./types.ts";

const OPCODE_HALT = 99;
export const run = (
  initialMemory: number[],
  input?: number,
  pointer = 0,
): RunStatus => {
  let memory = [...initialMemory];

  while (memory[pointer] !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory);

    if (instruction.type === "input" && typeof input === "undefined") {
      return { status: "input", memory, pointer };
    }

    const instructionResult = getInstructionResult(instruction, memory, input);

    if (instruction.type === "input") {
      input = undefined;
    }

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

  return { status: "done", memory };
};
