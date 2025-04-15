const basePattern = [0, 1, 0, -1] as const;

export function generateNextPhase(currentPhase: number[]): number[] {
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
): number[] {
  let currentPhase = initialPhase;
  for (let i = 0; i < phases; i++) {
    currentPhase = generateNextPhase(currentPhase);
  }

  return currentPhase;
}
