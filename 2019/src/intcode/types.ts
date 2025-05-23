export type ParameterMode = "position" | "immediate" | "relative";

export interface Parameter {
  value: number;
  mode: ParameterMode;
}

export interface AddInstruction {
  type: "add";
  parameters: [Parameter, Parameter, Parameter];
}

export interface MultiplyInstruction {
  type: "multiply";
  parameters: [Parameter, Parameter, Parameter];
}

export interface InputInstruction {
  type: "input";
  parameters: [Parameter];
}

export interface OutputInstruction {
  type: "output";
  parameters: [Parameter];
}

export interface JumpIfTrueInstruction {
  type: "jump-if-true";
  parameters: [Parameter, Parameter];
}

export interface JumpIfFalseInstruction {
  type: "jump-if-false";
  parameters: [Parameter, Parameter];
}

export interface LessThanInstruction {
  type: "less-than";
  parameters: [Parameter, Parameter, Parameter];
}

export interface EqualsInstruction {
  type: "equals";
  parameters: [Parameter, Parameter, Parameter];
}

export interface AdjustRelativeBaseInstruction {
  type: "adjust-relative-base";
  parameters: [Parameter];
}

export type Instruction =
  | AddInstruction
  | MultiplyInstruction
  | InputInstruction
  | OutputInstruction
  | JumpIfTrueInstruction
  | JumpIfFalseInstruction
  | LessThanInstruction
  | EqualsInstruction
  | AdjustRelativeBaseInstruction;

export type InstructionResult =
  | {
      type: "update-value";
      address: number;
      value: number;
    }
  | { type: "request-input" }
  | { type: "set-output"; value: number }
  | { type: "set-pointer"; value: number }
  | { type: "update-relative-base"; value: number }
  | { type: "nothing" };

interface IntcodeComputerStatusDone {
  status: "done";
}

interface IntcodeComputerStatusInput {
  status: "input";
}

export interface IntcodeComputerStatusOutput {
  status: "output";
  output: number;
}

export type IntcodeComputerStatus =
  | IntcodeComputerStatusDone
  | IntcodeComputerStatusInput
  | IntcodeComputerStatusOutput;
