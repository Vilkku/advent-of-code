import { join } from "node:path";

export const getInput = async (
  importMetaDir: string,
  path: string,
): Promise<string> => {
  const file = Bun.file(join(importMetaDir, path));
  const text = await file.text();

  return text.replace(/\n$/, "");
};

export const inputToRows = (input: string): string[] => input.split("\n");
export const inputToIntcodeComputerMemory = (input: string): number[] =>
  input.split(",").map(toInt);

export const toInt = (input: string): number => {
  const num = parseInt(input, 10);

  if (isNaN(num)) {
    throw new Error(`${input} cannot be parsed with parseInt()`);
  }

  return num;
};
