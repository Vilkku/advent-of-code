import { printAnswer } from "../util/benchmark";
import { getInput, inputToIntcodeComputerMemory } from "../util/input";
import { printImageData } from "../util/map";
import { mapTractorBeam, mapTractorBeamAndCheckIfSantaFits } from "./funcs";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

printAnswer(
  "Part 1",
  () => {
    const tractorBeamMap = mapTractorBeam(initialMemory, 50, 50);

    printImageData(tractorBeamMap);

    const affectedPointsNum = tractorBeamMap.reduce((sum, row) => {
      return (
        sum +
        row.reduce((rowSum, point) => {
          return rowSum + point;
        }, 0)
      );
    }, 0);
    return affectedPointsNum;
  },
  126,
);

printAnswer(
  "Part 2",
  () => {
    const tractorBeamMap = mapTractorBeamAndCheckIfSantaFits(
      initialMemory,
      100,
      100,
    );

    return (
      tractorBeamMap.santaCoords[0] * 10000 + tractorBeamMap.santaCoords[1]
    );
  },
  11351625,
);
