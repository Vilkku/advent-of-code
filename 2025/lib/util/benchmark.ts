import { expect } from "bun:test";

export const printAnswer = <T extends string | number>(
  title: string,
  getAnswer: () => T,
  expectedAnswer?: T,
) => {
  const start = performance.now();
  const answer = getAnswer();
  const end = performance.now();

  const duration = end - start;

  console.log(`${title}:`, answer, `(${duration}ms)`);

  if (expectedAnswer) {
    expect(answer).toBe(expectedAnswer);
  }
};
