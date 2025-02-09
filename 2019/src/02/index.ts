import { getInput, inputToNumbers } from "../util/input.ts";

import { run } from "../intcode/run.ts";

const initialMemory = inputToNumbers(
  await getInput(import.meta.dir, "input.txt"),
);

const part1InitialMemory = [...initialMemory];
part1InitialMemory[1] = 12;
part1InitialMemory[2] = 2;

const part1Memory = run(initialMemory);

console.log("Part 1", part1Memory.memory[0]);

const getPart2Answer = (initialMemory: number[]) => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const part2InitialMemory = [...initialMemory];
      part2InitialMemory[1] = noun;
      part2InitialMemory[2] = verb;

      const part2Memory = run(part2InitialMemory);

      if (part2Memory.memory[0] === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
};

console.log("Part 2", getPart2Answer(initialMemory));
