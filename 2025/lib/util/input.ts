import { join } from "node:path";

export const getInput = async (
  importMetaDir: string,
  path: string,
): Promise<string> => {
  const file = Bun.file(join(importMetaDir, path));
  const text = await file.text();

  return text.replace(/\n$/, "");
};
