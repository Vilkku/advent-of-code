import { toInt } from "../util/input.ts";
import {
  generateParameters,
  getParameterValue,
  getParameterValueFromMemory,
  parseParameterMode,
} from "./parameter.ts";
import type {
  AddInstruction,
  AdjustRelativeBaseInstruction,
  EqualsInstruction,
  InputInstruction,
  Instruction,
  InstructionResult,
  JumpIfFalseInstruction,
  JumpIfTrueInstruction,
  LessThanInstruction,
  MultiplyInstruction,
  OutputInstruction,
  ParameterMode,
} from "./types.ts";
import { readFromMemory } from "./readFromMemory.ts";

export const parseInstruction = (
  pointer: number,
  memory: number[],
): Instruction => {
  const opcodeValue = readFromMemory(memory, pointer);
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
    case 9:
      return parseAdjustRelativeBaseInstruction(
        pointer,
        parameterModes,
        memory,
      );
    default:
      throw new Error(`Unknown opcode ${opcode}`);
  }
};

const parseInstructionWithParameters = <T extends Instruction>(
  type: T["type"],
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
  parameterCount: number,
): T =>
  ({
    type,
    parameters: generateParameters(
      pointer,
      memory,
      parameterModes,
      parameterCount,
    ) as T["parameters"],
  }) as T;

const parseAddInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AddInstruction =>
  parseInstructionWithParameters("add", pointer, parameterModes, memory, 3);

const parseMultiplyInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): MultiplyInstruction =>
  parseInstructionWithParameters(
    "multiply",
    pointer,
    parameterModes,
    memory,
    3,
  );

const parseInputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): InputInstruction =>
  parseInstructionWithParameters("input", pointer, parameterModes, memory, 1);

const parseOutputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): OutputInstruction =>
  parseInstructionWithParameters("output", pointer, parameterModes, memory, 1);

const parseJumpIfTrueInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): JumpIfTrueInstruction =>
  parseInstructionWithParameters(
    "jump-if-true",
    pointer,
    parameterModes,
    memory,
    2,
  );

const parseJumpIfFalseInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): JumpIfFalseInstruction =>
  parseInstructionWithParameters(
    "jump-if-false",
    pointer,
    parameterModes,
    memory,
    2,
  );

const parseLessThanInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): LessThanInstruction =>
  parseInstructionWithParameters(
    "less-than",
    pointer,
    parameterModes,
    memory,
    3,
  );

const parseEqualsInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): EqualsInstruction =>
  parseInstructionWithParameters("equals", pointer, parameterModes, memory, 3);

const parseAdjustRelativeBaseInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AdjustRelativeBaseInstruction =>
  parseInstructionWithParameters(
    "adjust-relative-base",
    pointer,
    parameterModes,
    memory,
    1,
  );

export function getInstructionResult(
  instruction: Exclude<Instruction, InputInstruction>,
  memory: number[],
  relativeBase: number,
): InstructionResult {
  const { type, parameters } = instruction;

  switch (type) {
    case "add":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value:
          getParameterValueFromMemory(parameters[0], memory, relativeBase) +
          getParameterValueFromMemory(parameters[1], memory, relativeBase),
      };
    case "multiply":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value:
          getParameterValueFromMemory(parameters[0], memory, relativeBase) *
          getParameterValueFromMemory(parameters[1], memory, relativeBase),
      };
    case "output":
      return {
        type: "set-output",
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase),
      };
    case "jump-if-true":
      return getParameterValueFromMemory(
        parameters[0],
        memory,
        relativeBase,
      ) !== 0
        ? {
            type: "set-pointer",
            value: getParameterValueFromMemory(
              parameters[1],
              memory,
              relativeBase,
            ),
          }
        : { type: "nothing" };
    case "jump-if-false":
      return getParameterValueFromMemory(
        parameters[0],
        memory,
        relativeBase,
      ) === 0
        ? {
            type: "set-pointer",
            value: getParameterValueFromMemory(
              parameters[1],
              memory,
              relativeBase,
            ),
          }
        : { type: "nothing" };
    case "less-than":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value:
          getParameterValueFromMemory(parameters[0], memory, relativeBase) <
          getParameterValueFromMemory(parameters[1], memory, relativeBase)
            ? 1
            : 0,
      };
    case "equals":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value:
          getParameterValueFromMemory(parameters[0], memory, relativeBase) ===
          getParameterValueFromMemory(parameters[1], memory, relativeBase)
            ? 1
            : 0,
      };
    case "adjust-relative-base":
      return {
        type: "update-relative-base",
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase),
      };
  }
}

export function getInputInstructionResult(
  instruction: InputInstruction,
  relativeBase: number,
  input: number | undefined,
): InstructionResult {
  const { parameters } = instruction;

  if (typeof input === "undefined") {
    return { type: "request-input" };
  }

  return {
    type: "update-value",
    address: getParameterValue(parameters[0], relativeBase),
    value: input,
  };
}
