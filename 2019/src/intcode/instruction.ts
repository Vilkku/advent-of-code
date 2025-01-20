import { toInt } from "../util/input.ts";
import {
  createParameters,
  getParameterValue,
  type Parameter,
  type ParameterMode,
  parseParameterMode,
} from "./parameter.ts";

interface AddInstruction {
  type: "add";
  parameters: [Parameter, Parameter, Parameter];
}

interface MultiplyInstruction {
  type: "multiply";
  parameters: [Parameter, Parameter, Parameter];
}

interface InputInstruction {
  type: "input";
  parameters: [Parameter];
  connection: () => number;
}

interface OutputInstruction {
  type: "output";
  parameters: [Parameter];
  connection: (value: number) => void;
}

type Instruction =
  | AddInstruction
  | MultiplyInstruction
  | InputInstruction
  | OutputInstruction;

type InstructionResult = {
  address: number;
  value: number;
} | null;

export interface Connections {
  input?: InputInstruction["connection"];
  output?: OutputInstruction["connection"];
}

export const parseInstruction = (
  pointer: number,
  memory: number[],
  connections?: Connections,
): Instruction => {
  const opcodeValue = memory[pointer];
  const opcodeDigits = opcodeValue.toString().split("").map(toInt);
  const opcode =
    opcodeDigits.length > 1
      ? toInt(
          `${opcodeDigits[opcodeDigits.length - 2]}${opcodeDigits[opcodeDigits.length - 1]}`,
        )
      : opcodeDigits[0];

  const parameterModes =
    opcodeDigits.length > 2
      ? opcodeDigits.slice(0, -2).reverse().map(parseParameterMode)
      : [];

  switch (opcode) {
    case 1:
      return parseAddInstruction(pointer, parameterModes, memory);
    case 2:
      return parseMultiplyInstruction(pointer, parameterModes, memory);
    case 3:
      return parseInputInstruction(
        pointer,
        parameterModes,
        memory,
        connections,
      );
    case 4:
      return parseOutputInstruction(
        pointer,
        parameterModes,
        memory,
        connections,
      );
    default:
      throw new Error(`Unknown opcode ${opcode}`);
  }
};

const parseAddInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AddInstruction => {
  const PARAMETER_COUNT = 3;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the add opcode");
  }

  const parameters = createParameters(
    pointer,
    memory,
    parameterModes,
    PARAMETER_COUNT,
  ) as [Parameter, Parameter, Parameter];

  return {
    type: "add",
    parameters,
  };
};

const parseMultiplyInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): MultiplyInstruction => {
  const PARAMETER_COUNT = 3;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the add opcode");
  }

  const parameters = createParameters(
    pointer,
    memory,
    parameterModes,
    PARAMETER_COUNT,
  ) as [Parameter, Parameter, Parameter];

  return {
    type: "multiply",
    parameters,
  };
};

const parseInputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
  connections?: Connections,
): InputInstruction => {
  if (!connections?.input) {
    throw new Error("Missing connection for input");
  }

  const PARAMETER_COUNT = 1;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the input opcode");
  }

  const parameters = createParameters(
    pointer,
    memory,
    parameterModes,
    PARAMETER_COUNT,
  ) as [Parameter];

  return {
    type: "input",
    parameters,
    connection: connections.input,
  };
};

const parseOutputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
  connections?: Connections,
): OutputInstruction => {
  if (!connections?.output) {
    throw new Error("Missing connection for output");
  }

  const PARAMETER_COUNT = 1;

  if (pointer + PARAMETER_COUNT >= memory.length) {
    throw new Error("Insufficient parameters in memory for the output opcode");
  }

  const parameters = createParameters(
    pointer,
    memory,
    parameterModes,
    PARAMETER_COUNT,
  ) as [Parameter];

  return {
    type: "output",
    parameters,
    connection: connections.output,
  };
};

export const getInstructionResult = (
  instruction: Instruction,
  memory: number[],
): InstructionResult => {
  const { type, parameters } = instruction;

  switch (type) {
    case "add":
      return {
        address: parameters[2].value,
        value: add(
          getParameterValue(parameters[0], memory),
          getParameterValue(parameters[1], memory),
        ),
      };
    case "multiply":
      return {
        address: parameters[2].value,
        value: multiply(
          getParameterValue(parameters[0], memory),
          getParameterValue(parameters[1], memory),
        ),
      };
    case "input":
      return {
        address: parameters[0].value,
        value: instruction.connection(),
      };
    case "output":
      instruction.connection(getParameterValue(parameters[0], memory));
      return null;
  }
};

const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
