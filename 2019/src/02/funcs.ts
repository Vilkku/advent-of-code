export enum Opcode {
  Add = 1,
  Multiply = 2,
}

const OPCODE_HALT = 99;

type Instruction = [Opcode, ...number[]];

const parameterAmounts: Record<Opcode, number> = {
  [Opcode.Add]: 3,
  [Opcode.Multiply]: 3,
};

export const run = (initialMemory: number[]): number[] => {
  let memory = [...initialMemory];
  let pointer = 0;

  while (memory[pointer] !== OPCODE_HALT) {
    const opcode = parseOpcode(memory[pointer]);

    const paramCount = parameterAmounts[opcode];
    if (pointer + paramCount >= memory.length) {
      throw new Error(
        "Insufficient parameters in memory for the current opcode",
      );
    }

    const instruction: Instruction = [
      opcode,
      ...memory.slice(pointer + 1, pointer + 1 + paramCount),
    ];

    const [address, value] = executeInstruction(instruction, memory);
    memory[address] = value;

    pointer += paramCount + 1;
  }

  return memory;
};

const parseOpcode = (value: number): Opcode => {
  if (!Object.values(Opcode).includes(value)) {
    throw new Error("Invalid opcode");
  }

  return value as Opcode;
};

export const executeInstruction = (
  [opcode, ...parameters]: Instruction,
  memory: number[],
): [number, number] => {
  if (parameterAmounts[opcode] !== parameters.length) {
    throw new Error("Invalid parameter amount");
  }

  switch (opcode) {
    case Opcode.Add:
      return [parameters[2], add(memory[parameters[0]], memory[parameters[1]])];
    case Opcode.Multiply:
      return [
        parameters[2],
        multiply(memory[parameters[0]], memory[parameters[1]]),
      ];
  }
};

const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
