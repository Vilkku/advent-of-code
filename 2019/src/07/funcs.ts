import { run } from "../intcode/run";

export function getMaxThrusterSignal(initialMemory: number[]) {
  const minPhaseSetting = 0;
  const maxPhaseSetting = 4;
  let highestSignal = 0;

  function getNextOutput(phaseSetting: number, previousOutput: number): number {
    const firstStatus = run(initialMemory, phaseSetting);

    if (firstStatus.status !== "input") {
      throw new Error(
        `Expected status to be "input", got "${firstStatus.status}"`,
      );
    }

    const secondStatus = run(
      firstStatus.memory,
      previousOutput,
      firstStatus.pointer,
    );

    if (secondStatus.status !== "output") {
      throw new Error(
        `Expected status to be "output", got "${secondStatus.status}"`,
      );
    }

    return secondStatus.output;
  }

  for (
    let aPhaseSetting = minPhaseSetting;
    aPhaseSetting <= maxPhaseSetting;
    aPhaseSetting++
  ) {
    const aOutput = getNextOutput(aPhaseSetting, 0);

    for (
      let bPhaseSetting = minPhaseSetting;
      bPhaseSetting <= maxPhaseSetting;
      bPhaseSetting++
    ) {
      if ([aPhaseSetting].includes(bPhaseSetting)) {
        continue;
      }

      const bOutput = getNextOutput(bPhaseSetting, aOutput);

      for (
        let cPhaseSetting = minPhaseSetting;
        cPhaseSetting <= maxPhaseSetting;
        cPhaseSetting++
      ) {
        if ([aPhaseSetting, bPhaseSetting].includes(cPhaseSetting)) {
          continue;
        }

        const cOutput = getNextOutput(cPhaseSetting, bOutput);

        for (
          let dPhaseSetting = minPhaseSetting;
          dPhaseSetting <= maxPhaseSetting;
          dPhaseSetting++
        ) {
          if (
            [aPhaseSetting, bPhaseSetting, cPhaseSetting].includes(
              dPhaseSetting,
            )
          ) {
            continue;
          }

          const dOutput = getNextOutput(dPhaseSetting, cOutput);

          for (
            let ePhaseSetting = minPhaseSetting;
            ePhaseSetting <= maxPhaseSetting;
            ePhaseSetting++
          ) {
            if (
              [
                aPhaseSetting,
                bPhaseSetting,
                cPhaseSetting,
                dPhaseSetting,
              ].includes(ePhaseSetting)
            ) {
              continue;
            }

            const eOutput = getNextOutput(ePhaseSetting, dOutput);

            if (eOutput > highestSignal) {
              highestSignal = eOutput;
            }
          }
        }
      }
    }
  }

  return highestSignal;
}
