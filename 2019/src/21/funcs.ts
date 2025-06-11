import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

type ReadOnlyRegister = "A" | "B" | "C" | "D";
type WritableRegister = "T" | "J";
type Register = ReadOnlyRegister | WritableRegister;
type InstructionType = "AND" | "OR" | "NOT";
export type Instruction = `${InstructionType} ${Register} ${WritableRegister}`;
export type Program = Instruction[];

function compileProgram(program: Program): number[] {
  if (program.length > 15) {
    throw new Error(
      "Program contains more than the maximum of 15 instructions",
    );
  }

  const ASCII_NEWLINE = 10;
  return [...program, "WALK"].flatMap((i) => [
    ...i.split("").map((c) => c.charCodeAt(0)),
    ASCII_NEWLINE,
  ]);
}

export function runProgram(initialMemory: number[], program: Program) {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  const asciiCodes = compileProgram(program);
  const output = [];

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
