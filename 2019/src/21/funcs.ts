import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

type ReadOnlyWalkRegister = "A" | "B" | "C" | "D";
type ReadOnlRunRegister = "E" | "F" | "G" | "H" | "I";
type WritableRegister = "T" | "J";
type InstructionType = "AND" | "OR" | "NOT";

type WalkRegister = ReadOnlyWalkRegister | WritableRegister;
type RunRegister = ReadOnlyWalkRegister | ReadOnlRunRegister | WritableRegister;

export type WalkInstruction =
  `${InstructionType} ${WalkRegister} ${WritableRegister}`;
export type RunInstruction =
  `${InstructionType} ${RunRegister} ${WritableRegister}`;

export type WalkProgram = WalkInstruction[];
export type RunProgram = RunInstruction[];

export function compileProgram(
  program: WalkProgram | RunProgram,
  mode: "WALK" | "RUN" = "WALK",
): number[] {
  if (program.length > 15) {
    throw new Error(
      "Program contains more than the maximum of 15 instructions",
    );
  }

  const ASCII_NEWLINE = 10;
  return [...program, mode].flatMap((i) => [
    ...i.split("").map((c) => c.charCodeAt(0)),
    ASCII_NEWLINE,
  ]);
}

export function runProgram(
  initialMemory: number[],
  program: WalkProgram | RunProgram,
  mode: "WALK" | "RUN" = "WALK",
): number[] {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  const asciiCodes = compileProgram(program, mode);
  const output: number[] = [];

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        output.push(computerStatus.output);
        computerStatus = computer.run();
        break;
      case "input":
        const nextAsciiCode = asciiCodes.shift();

        if (!nextAsciiCode) {
          throw new Error("Unexpected input status");
        }

        computer.enqueueInput(nextAsciiCode);
        computerStatus = computer.run();
    }
  }

  return output;
}
