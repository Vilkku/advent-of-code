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
}

interface OutputInstruction {
  type: "output";
  parameters: [Parameter];
}

interface JumpIfTrueInstruction {
  type: "jump-if-true";
  parameters: [Parameter, Parameter];
}

interface JumpIfFalseInstruction {
  type: "jump-if-false";
  parameters: [Parameter, Parameter];
}

interface LessThanInstruction {
  type: "less-than";
  parameters: [Parameter, Parameter, Parameter];
}

interface EqualsInstruction {
  type: "equals";
  parameters: [Parameter, Parameter, Parameter];
}

type Instruction =
  | AddInstruction
  | MultiplyInstruction
  | InputInstruction
  | OutputInstruction
  | JumpIfTrueInstruction
  | JumpIfFalseInstruction
  | LessThanInstruction
  | EqualsInstruction;

type InstructionResult =
  | {
      type: "update-value";
      address: number;
      value: number;
    }
  | { type: "set-output"; value: number }
  | { type: "set-pointer"; value: number }
  | { type: "nothing" };

export const parseInstruction = (
  pointer: number,
  memory: number[],
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
      return parseInputInstruction(pointer, parameterModes, memory);
    case 4:
      return parseOutputInstruction(pointer, parameterModes, memory);
    case 5:
      return parseJumpIfTrueInstruction(pointer, parameterModes, memory);
    case 6:
      return parseJumpIfFalseInstruction(pointer, parameterModes, memory);
    case 7:
      return parseLessThanInstruction(pointer, parameterModes, memory);
    case 8:
      return parseEqualsInstruction(pointer, parameterModes, memory);
    default:
      throw new Error(`Unknown opcode ${opcode}`);
  }
};

const parseAddInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AddInstruction => ({
  type: "add",
  parameters: createParameters(pointer, memory, parameterModes, 3) as [
    Parameter,
    Parameter,
    Parameter,
  ],
});

const parseMultiplyInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): MultiplyInstruction => ({
  type: "multiply",
  parameters: createParameters(pointer, memory, parameterModes, 3) as [
    Parameter,
    Parameter,
    Parameter,
  ],
});

const parseInputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): InputInstruction => ({
  type: "input",
  parameters: createParameters(pointer, memory, parameterModes, 1) as [
    Parameter,
  ],
});

const parseOutputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): OutputInstruction => ({
  type: "output",
  parameters: createParameters(pointer, memory, parameterModes, 1) as [
    Parameter,
  ],
});

const parseJumpIfTrueInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): JumpIfTrueInstruction => ({
  type: "jump-if-true",
  parameters: createParameters(pointer, memory, parameterModes, 2) as [
    Parameter,
    Parameter,
  ],
});

const parseJumpIfFalseInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): JumpIfFalseInstruction => ({
  type: "jump-if-false",
  parameters: createParameters(pointer, memory, parameterModes, 2) as [
    Parameter,
    Parameter,
  ],
});

const parseLessThanInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): LessThanInstruction => ({
  type: "less-than",
  parameters: createParameters(pointer, memory, parameterModes, 3) as [
    Parameter,
    Parameter,
    Parameter,
  ],
});

const parseEqualsInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): EqualsInstruction => ({
  type: "equals",
  parameters: createParameters(pointer, memory, parameterModes, 3) as [
    Parameter,
    Parameter,
    Parameter,
  ],
});

export const getInstructionResult = (
  instruction: Instruction,
  memory: number[],
  input?: number,
): InstructionResult => {
  const { type, parameters } = instruction;

  switch (type) {
    case "add":
      return {
        type: "update-value",
        address: parameters[2].value,
        value:
          getParameterValue(parameters[0], memory) +
          getParameterValue(parameters[1], memory),
      };
    case "multiply":
      return {
        type: "update-value",
        address: parameters[2].value,
        value:
          getParameterValue(parameters[0], memory) *
          getParameterValue(parameters[1], memory),
      };
    case "input":
      if (typeof input === "undefined") {
        throw new Error("Missing input");
      }

      return {
        type: "update-value",
        address: parameters[0].value,
        value: input,
      };
    case "output":
      return {
        type: "set-output",
        value: getParameterValue(parameters[0], memory),
      };
    case "jump-if-true":
      return getParameterValue(parameters[0], memory) !== 0
        ? {
            type: "set-pointer",
            value: getParameterValue(parameters[1], memory),
          }
        : { type: "nothing" };
    case "jump-if-false":
      return getParameterValue(parameters[0], memory) === 0
        ? {
            type: "set-pointer",
            value: getParameterValue(parameters[1], memory),
          }
        : { type: "nothing" };
    case "less-than":
      return {
        type: "update-value",
        address: parameters[2].value,
        value:
          getParameterValue(parameters[0], memory) <
          getParameterValue(parameters[1], memory)
            ? 1
            : 0,
      };
    case "equals":
      return {
        type: "update-value",
        address: parameters[2].value,
        value:
          getParameterValue(parameters[0], memory) ===
          getParameterValue(parameters[1], memory)
            ? 1
            : 0,
      };
  }
};
