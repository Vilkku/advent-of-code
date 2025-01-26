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
