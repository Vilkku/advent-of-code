import { printAnswer } from "../util/benchmark";
import { getInput, inputToIntcodeComputerMemory, toInt } from "../util/input";
import { printImageData } from "../util/map";
import { mapTractorBeam } from "./funcs";

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
