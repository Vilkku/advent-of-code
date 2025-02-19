import type { Parameter, ParameterMode } from "./types.ts";
import { readFromMemory } from "./readFromMemory.ts";

export const parseParameterMode = (value: number): ParameterMode => {
  switch (value) {
    case 0:
      return "position";
    case 1:
      return "immediate";
    case 2:
      return "relative";
    default:
      throw new Error(`Unknown parameter mode ${value}`);
  }
};

export const generateParameters = (
  pointer: number,
  memory: number[],
  parameterModes: ParameterMode[],
  parameterCount: number,
): Parameter[] => {
  if (pointer + parameterCount >= memory.length) {
    throw new Error("Cannot create parameter, out of memory");
  }

  const parameters: Parameter[] = memory
    .slice(pointer + 1, pointer + 1 + parameterCount)
    .map((value, index) => ({
      value,
      mode: parameterModes[index] ?? "position",
    }));

  if (parameters.length !== parameterCount) {
    throw new Error("Invalid parameter count");
  }

  return parameters;
};

export const getParameterValue = (
  parameter: Parameter,
  relativeBase: number,
): number => {
  switch (parameter.mode) {
    case "position":
    case "immediate":
      return parameter.value;
    case "relative":
      return parameter.value + relativeBase;
  }
};

export const getParameterValueFromMemory = (
  parameter: Parameter,
  memory: number[],
  relativeBase: number,
): number => {
  switch (parameter.mode) {
    case "position":
      return readFromMemory(memory, parameter.value);
    case "immediate":
      return parameter.value;
    case "relative":
      return readFromMemory(memory, parameter.value + relativeBase);
  }
};
