import { getInstructionResult, parseInstruction } from "./instruction.ts";

const OPCODE_HALT = 99;
export const run = (
  initialMemory: number[],
  input?: number,
): { memory: number[]; output: number[] } => {
  let memory = [...initialMemory];
  let pointer = 0;
  const output: number[] = [];

  while (memory[pointer] !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory);
    const instructionResult = getInstructionResult(instruction, memory, input);

    switch (instructionResult.type) {
      case "update-value":
        memory[instructionResult.address] = instructionResult.value;
        pointer += instruction.parameters.length + 1;
        break;
      case "set-output":
        output.push(instructionResult.value);
        pointer += instruction.parameters.length + 1;
        break;
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

  return { memory, output };
};
