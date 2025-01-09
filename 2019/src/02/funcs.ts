interface Opcode {
  type: "add" | "multiply";
  opcode: number;
  parameterCount: number;
}

interface Instruction {
  opcode: Opcode;
  parameters: number[];
}

interface InstructionResult {
  address: number;
  value: number;
}

const OPCODE_HALT = 99;

export const run = (initialMemory: number[]): number[] => {
  let memory = [...initialMemory];
  let pointer = 0;

  while (memory[pointer] !== OPCODE_HALT) {
    const opcode = parseOpcode(memory[pointer]);

    if (pointer + opcode.parameterCount >= memory.length) {
      throw new Error(
        "Insufficient parameters in memory for the current opcode",
      );
    }

    const instruction: Instruction = {
      opcode,
      parameters: memory.slice(
        pointer + 1,
        pointer + 1 + opcode.parameterCount,
      ),
    };

    const { address, value } = getInstructionResult(instruction, memory);
    memory[address] = value;

    pointer += opcode.parameterCount + 1;
  }

  return memory;
};

export const parseOpcode = (value: number): Opcode => {
  switch (value) {
    case 1:
      return {
        type: "add",
        opcode: 1,
        parameterCount: 3,
      };
    case 2:
      return {
        type: "multiply",
        opcode: 2,
        parameterCount: 3,
      };
    default:
      throw new Error("Invalid opcode");
  }
};

export const getInstructionResult = (
  { opcode, parameters }: Instruction,
  memory: number[],
): InstructionResult => {
  if (opcode.parameterCount !== parameters.length) {
    throw new Error("Invalid parameter amount");
  }

  switch (opcode.type) {
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
