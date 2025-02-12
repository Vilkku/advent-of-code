import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

function generatePermutations(min: number, max: number): number[][] {
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

export function getMaxThrusterSignal(
  initialMemory: number[],
  minSetting: number,
  maxSetting: number,
) {
  const permutations = generatePermutations(minSetting, maxSetting);

  const results = permutations.map(([a, b, c, d, e]) => {
    const aComputer = new IntcodeComputer(initialMemory, [a, 0]);
    const bComputer = new IntcodeComputer(initialMemory, [b]);
    const cComputer = new IntcodeComputer(initialMemory, [c]);
    const dComputer = new IntcodeComputer(initialMemory, [d]);
    const eComputer = new IntcodeComputer(initialMemory, [e]);

    let done = false;
    let lastEOutput = 0;

    while (!done) {
      const aResult = aComputer.run();

      switch (aResult.status) {
        case "output":
          bComputer.inputQueue.push(aResult.output);
          break;
        case "done":
          done = true;
          break;
        default:
          throw new Error(`Unexpected status "${aResult.status}"`);
      }

      const bResult = bComputer.run();

      switch (bResult.status) {
        case "output":
          cComputer.inputQueue.push(bResult.output);
          break;
        case "done":
          done = true;
          break;
        default:
          throw new Error(`Unexpected status "${bResult.status}"`);
      }

      const cResult = cComputer.run();

      switch (cResult.status) {
        case "output":
          dComputer.inputQueue.push(cResult.output);
          break;
        case "done":
          done = true;
          break;
        default:
          throw new Error(`Unexpected status "${cResult.status}"`);
      }

      const dResult = dComputer.run();

      switch (dResult.status) {
        case "output":
          eComputer.inputQueue.push(dResult.output);
          break;
        case "done":
          done = true;
          break;
        default:
          throw new Error(`Unexpected status "${dResult.status}"`);
      }

      const eResult = eComputer.run();

      switch (eResult.status) {
        case "output":
          lastEOutput = eResult.output;
          break;
        case "done":
          done = true;
          break;
        default:
          throw new Error(`Unexpected status "${eResult.status}"`);
      }
    }

    return lastEOutput;
  });

  return Math.max(...results);
}
