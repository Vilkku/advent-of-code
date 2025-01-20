export type ParameterMode = "position" | "immediate";

export interface Parameter {
  value: number;
  mode: ParameterMode;
}

export const parseParameterMode = (value: number): ParameterMode => {
  switch (value) {
    case 0:
      return "position";
    case 1:
      return "immediate";
    default:
      throw new Error(`Unknown parameter mode ${value}`);
  }
};

export const createParameters = (
  pointer: number,
  memory: number[],
  parameterModes: ParameterMode[],
  parameterCount: number,
): Parameter[] => {
  const parameters: Parameter[] = memory
    .slice(pointer + 1, pointer + 1 + parameterCount)
    .map((value, index) => createParameter(value, parameterModes[index]));

  if (parameters.length !== parameterCount) {
    throw new Error("Invalid parameter count");
  }

  return parameters;
};

const DEFAULT_PARAMETER_MODE = "position";
export const createParameter = (
  value: number,
  mode: ParameterMode = DEFAULT_PARAMETER_MODE,
): Parameter => ({
  value,
  mode,
});

export const getParameterValue = (
  parameter: Parameter,
  memory: number[],
): number => {
  switch (parameter.mode) {
    case "position":
      if (typeof memory[parameter.value] === "undefined") {
        throw new Error("Invalid memory address");
      }

      return memory[parameter.value];
    case "immediate":
      return parameter.value;
    default:
      throw new Error(`Unknown parameter mode ${parameter.mode}`);
  }
};
