import { run } from "../intcode/run";

export function getMaxThrusterSignal(initialMemory: number[]) {
  const minPhaseSetting = 0;
  const maxPhaseSetting = 4;
  let highestSignal = 0;

  for (
    let aPhaseSetting = minPhaseSetting;
    aPhaseSetting <= maxPhaseSetting;
    aPhaseSetting++
  ) {
    const { output: aOutput } = run(initialMemory, [aPhaseSetting, 0]);

    if (aOutput.length === 0) {
      throw new Error("A output is empty");
    }

    for (
      let bPhaseSetting = minPhaseSetting;
      bPhaseSetting <= maxPhaseSetting;
      bPhaseSetting++
    ) {
      if ([aPhaseSetting].includes(bPhaseSetting)) {
        continue;
      }

      const { output: bOutput } = run(initialMemory, [
        bPhaseSetting,
        aOutput[0],
      ]);

      if (bOutput.length === 0) {
        throw new Error("B output is empty");
      }

      for (
        let cPhaseSetting = minPhaseSetting;
        cPhaseSetting <= maxPhaseSetting;
        cPhaseSetting++
      ) {
        if ([aPhaseSetting, bPhaseSetting].includes(cPhaseSetting)) {
          continue;
        }

        const { output: cOutput } = run(initialMemory, [
          cPhaseSetting,
          bOutput[0],
        ]);

        if (cOutput.length === 0) {
          throw new Error("C output is empty");
        }

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

          const { output: dOutput } = run(initialMemory, [
            dPhaseSetting,
            cOutput[0],
          ]);

          if (dOutput.length === 0) {
            throw new Error("D output is empty");
          }

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

            const { output: eOutput } = run(initialMemory, [
              ePhaseSetting,
              dOutput[0],
            ]);

            if (eOutput.length === 0) {
              throw new Error("B output is empty");
            }

            if (eOutput[0] > highestSignal) {
              highestSignal = eOutput[0];
            }
          }
        }
      }
    }
  }

  return highestSignal;
}
