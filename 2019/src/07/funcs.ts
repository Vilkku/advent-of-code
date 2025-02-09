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
    const aFirstStatus = run(initialMemory, aPhaseSetting);

    if (aFirstStatus.status !== "input") {
      console.log(aFirstStatus);
      throw new Error(`Expected A input, got ${aFirstStatus.status}`);
    }

    const aSecondStatus = run(aFirstStatus.memory, 0, aFirstStatus.pointer);

    if (aSecondStatus.status !== "output") {
      throw new Error(`Expected A output, got ${aSecondStatus.status}`);
    }

    for (
      let bPhaseSetting = minPhaseSetting;
      bPhaseSetting <= maxPhaseSetting;
      bPhaseSetting++
    ) {
      if ([aPhaseSetting].includes(bPhaseSetting)) {
        continue;
      }

      const bFirstStatus = run(initialMemory, bPhaseSetting);

      if (bFirstStatus.status !== "input") {
        throw new Error(`Expected B input, got ${bFirstStatus.status}`);
      }

      const bSecondStatus = run(
        bFirstStatus.memory,
        aSecondStatus.output,
        bFirstStatus.pointer,
      );

      if (bSecondStatus.status !== "output") {
        throw new Error(`Expected B output, got ${bSecondStatus.status}`);
      }

      for (
        let cPhaseSetting = minPhaseSetting;
        cPhaseSetting <= maxPhaseSetting;
        cPhaseSetting++
      ) {
        if ([aPhaseSetting, bPhaseSetting].includes(cPhaseSetting)) {
          continue;
        }

        const cFirstStatus = run(initialMemory, cPhaseSetting);

        if (cFirstStatus.status !== "input") {
          throw new Error(`Expected C input, got ${cFirstStatus.status}`);
        }

        const cSecondStatus = run(
          cFirstStatus.memory,
          bSecondStatus.output,
          cFirstStatus.pointer,
        );

        if (cSecondStatus.status !== "output") {
          throw new Error(`Expected C output, got ${bSecondStatus.status}`);
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

          const dFirstStatus = run(initialMemory, dPhaseSetting);

          if (dFirstStatus.status !== "input") {
            throw new Error(`Expected D input, got ${dFirstStatus.status}`);
          }

          const dSecondStatus = run(
            dFirstStatus.memory,
            cSecondStatus.output,
            dFirstStatus.pointer,
          );

          if (dSecondStatus.status !== "output") {
            throw new Error(`Expected D output, got ${dSecondStatus.status}`);
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

            const eFirstStatus = run(initialMemory, ePhaseSetting);

            if (eFirstStatus.status !== "input") {
              throw new Error(`Expected E input, got ${eFirstStatus.status}`);
            }

            const eSecondStatus = run(
              eFirstStatus.memory,
              dSecondStatus.output,
              eFirstStatus.pointer,
            );

            if (eSecondStatus.status !== "output") {
              throw new Error(`Expected E output, got ${eSecondStatus.status}`);
            }

            if (eSecondStatus.output > highestSignal) {
              highestSignal = eSecondStatus.output;
            }
          }
        }
      }
    }
  }

  return highestSignal;
}
