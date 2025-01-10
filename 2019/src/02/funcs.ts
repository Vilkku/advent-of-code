interface AddInstruction {
  type: "add";
  parameters: [number, number, number];
}

interface MultiplyInstruction {
  type: "multiply";
  parameters: [number, number, number];
}

type Instruction = AddInstruction | MultiplyInstruction;

interface InstructionResult {
  address: number;
  value: number;
}

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

export const parseInstruction = (
  pointer: number,
  memory: number[],
): Instruction => {
  switch (memory[pointer]) {
    case 1:
      return parseAddInstruction(pointer, memory);
    case 2:
      return parseMultiplyInstruction(pointer, memory);
    default:
      throw new Error("Unknown opcode");
  }
};

const parseAddInstruction = (
  pointer: number,
  memory: number[],
): AddInstruction => {
  const PARAMETER_COUNT = 3;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the add opcode");
  }

  return {
    type: "add",
    parameters: memory.slice(pointer + 1, pointer + 1 + PARAMETER_COUNT) as [
      number,
      number,
      number,
    ],
  };
};

const parseMultiplyInstruction = (
  pointer: number,
  memory: number[],
): MultiplyInstruction => {
  const PARAMETER_COUNT = 3;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the add opcode");
  }

  return {
    type: "multiply",
    parameters: memory.slice(pointer + 1, pointer + 1 + PARAMETER_COUNT) as [
      number,
      number,
      number,
    ],
  };
};

export const getInstructionResult = (
  { type, parameters }: Instruction,
  memory: number[],
): InstructionResult => {
  switch (type) {
    case "add":
      return {
        address: parameters[2],
        value: add(memory[parameters[0]], memory[parameters[1]]),
      };
    case "multiply":
      return {
        address: parameters[2],
        value: multiply(memory[parameters[0]], memory[parameters[1]]),
      };
  }
};

const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
