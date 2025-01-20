import {
  type Connections,
  getInstructionResult,
  parseInstruction,
} from "./instruction.ts";

const OPCODE_HALT = 99;
export const run = (
  initialMemory: number[],
  connections?: Connections,
): number[] => {
  let memory = [...initialMemory];
  let pointer = 0;

  while (memory[pointer] !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory, connections);
    const instructionResult = getInstructionResult(instruction, memory);

    if (instructionResult !== null) {
      memory[instructionResult.address] = instructionResult.value;
    }

    pointer += instruction.parameters.length + 1;
  }

  return memory;
};
