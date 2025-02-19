export function readFromMemory(memory: number[], address: number) {
  if (address < 0) {
    throw new Error("Cannot access memory at negative address");
  }

  return memory[address] ?? 0;
}
