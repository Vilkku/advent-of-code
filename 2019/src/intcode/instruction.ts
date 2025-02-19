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
  Parameter,
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

const parseAddInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AddInstruction => ({
  type: "add",
  parameters: generateParameters(pointer, memory, parameterModes, 3) as [
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
  parameters: generateParameters(pointer, memory, parameterModes, 3) as [
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
  parameters: generateParameters(pointer, memory, parameterModes, 1) as [
    Parameter,
  ],
});

const parseOutputInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): OutputInstruction => ({
  type: "output",
  parameters: generateParameters(pointer, memory, parameterModes, 1) as [
    Parameter,
  ],
});

const parseJumpIfTrueInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): JumpIfTrueInstruction => ({
  type: "jump-if-true",
  parameters: generateParameters(pointer, memory, parameterModes, 2) as [
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
  parameters: generateParameters(pointer, memory, parameterModes, 2) as [
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
  parameters: generateParameters(pointer, memory, parameterModes, 3) as [
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
  parameters: generateParameters(pointer, memory, parameterModes, 3) as [
    Parameter,
    Parameter,
    Parameter,
  ],
});

const parseAdjustRelativeBaseInstruction = (
  pointer: number,
  parameterModes: ParameterMode[],
  memory: number[],
): AdjustRelativeBaseInstruction => ({
  type: "adjust-relative-base",
  parameters: generateParameters(pointer, memory, parameterModes, 1) as [
    Parameter,
  ],
});

export const getInstructionResult = (
  instruction: Instruction,
  memory: number[],
  relativeBase: number,
  input?: number,
): InstructionResult => {
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
    case "input":
      if (typeof input === "undefined") {
        throw new Error("Missing input");
      }

      return {
        type: "update-value",
        address: getParameterValue(parameters[0], relativeBase),
        value: input,
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
};
