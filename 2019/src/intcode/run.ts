import { getInstructionResult, parseInstruction } from "./instruction.ts";

const OPCODE_HALT = 99;
export const run = (initialMemory: number[]): number[] => {
  let memory = [...initialMemory];
  let pointer = 0;

  while (memory[pointer] !== OPCODE_HALT) {
    const instruction = parseInstruction(pointer, memory);
    const { address, value } = getInstructionResult(instruction, memory);
    memory[address] = value;

    pointer += instruction.parameters.length + 1;
  }

  return memory;
};
