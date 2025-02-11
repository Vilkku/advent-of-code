import { run } from "../intcode/run";
import type { RunStatus } from "../intcode/types.ts";

function getPermutations(min: number, max: number): number[][] {
  if (min >= max) {
    throw new Error("max should be bigger than min");
  }

  const permutations: number[][] = [];

  for (let a = min; a <= max; a++) {
    for (let b = min; b <= max; b++) {
      if ([a].includes(b)) {
        continue;
      }

      for (let c = min; c <= max; c++) {
        if ([a, b].includes(c)) {
          continue;
        }

        for (let d = min; d <= max; d++) {
          if ([a, b, c].includes(d)) {
            continue;
          }

          for (let e = min; e <= max; e++) {
            if ([a, b, c, d].includes(e)) {
              continue;
            }

            permutations.push([a, b, c, d, e]);
          }
        }
      }
    }
  }

  return permutations;
}

function getNextOutput(
  initialMemory: number[],
  input: number,
  previousOutput: number,
): RunStatus {
  const firstStatus = run(initialMemory, input);

  if (firstStatus.status !== "input") {
    throw new Error(
      `Expected status to be "input", got "${firstStatus.status}"`,
    );
  }

  return run(firstStatus.memory, previousOutput, firstStatus.pointer);
}

export function getMaxThrusterSignal(initialMemory: number[]) {
  const permutations = getPermutations(0, 4);

  const results = permutations.map(([a, b, c, d, e]) => {
    const aResult = getNextOutput(initialMemory, a, 0);

    if (aResult.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${aResult.status}"`,
      );
    }

    const bResult = getNextOutput(initialMemory, b, aResult.output);

    if (bResult.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${bResult.status}"`,
      );
    }

    const cResult = getNextOutput(initialMemory, c, bResult.output);

    if (cResult.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${cResult.status}"`,
      );
    }

    const dResult = getNextOutput(initialMemory, d, cResult.output);

    if (dResult.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${dResult.status}"`,
      );
    }

    const eResult = getNextOutput(initialMemory, e, dResult.output);

    if (eResult.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${eResult.status}"`,
      );
    }

    return eResult.output;
  });

  return Math.max(...results);
}
