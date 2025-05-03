import { expect } from "bun:test";

export const useBenchmark = () => {
  let current = performance.now();

  const reset = (): void => {
    current = performance.now();
  };

  const get = (): void => {
    const now = performance.now();
    console.log(`Took ${now - current}ms`);
    current = now;
  };

  return { reset, get };
};

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
