import { toInt } from "../util/input";

const basePattern = [0, 1, 0, -1] as const;

export function generateNextPhase(
  currentPhase: number[],
  offset = 0,
): number[] {
  if (offset > currentPhase.length / 2) {
    const nextPhase = new Array(currentPhase.length);
    let cumulativeSum = 0;

    for (let i = currentPhase.length - 1; i >= offset; i--) {
      cumulativeSum += currentPhase[i];
      nextPhase[i] = Math.abs(cumulativeSum % 10);
    }

    return nextPhase;
  }

  return currentPhase.map((_, index) => {
    const pattern: number[] = basePattern.flatMap((patternDigit) =>
      Array(index + 1).fill(patternDigit),
    );

    const sumOfDigitsWithPatternApplied = currentPhase.reduce(
      (acc, curr, index) => {
        const patternIndex = (index + 1) % pattern.length;

        if (isNaN(curr)) {
          throw new Error(`curr is NaN`);
        }

        return acc + curr * pattern[patternIndex];
      },
      0,
    );

    if (isNaN(sumOfDigitsWithPatternApplied)) {
      throw new Error(`sumOfDigitsWithPatternApplied is NaN`);
    }

    return Math.abs(sumOfDigitsWithPatternApplied % 10);
  });
}

export function generateNPhases(
  initialPhase: number[],
  phases: number,
  offset = 0,
): number[] {
  let currentPhase = initialPhase;
  for (let i = 0; i < phases; i++) {
    currentPhase = generateNextPhase(currentPhase, offset);
  }

  return currentPhase;
}

export function repeatArray<T>(arr: T[], count: number): T[] {
  const repeatedLength = arr.length * count;
  const result = [];

  for (let i = 0; i < repeatedLength; i++) {
    result.push(arr[i % arr.length]);
  }

  return result;
}

export function getMessageWithOffset(
  signal: number[],
  phases: number,
): number[] {
  const offset = toInt(signal.slice(0, 7).join(""));
  const repeatedSignal = repeatArray(signal, 10000);
  const finalPhase = generateNPhases(repeatedSignal, phases, offset);

  return finalPhase.slice(offset, offset + 8);
}
