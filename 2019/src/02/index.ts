import { getInput, inputToIntcodeComputerMemory } from "../util/input.ts";
import { expect } from "bun:test";

import { runUntilCompletion } from "../intcode/run.ts";

const initialMemory = inputToIntcodeComputerMemory(
  await getInput(import.meta.dir, "input.txt"),
);

const part1InitialMemory = [...initialMemory];
part1InitialMemory[1] = 12;
part1InitialMemory[2] = 2;

const part1Memory = runUntilCompletion(part1InitialMemory);

const part1Answer = part1Memory.memory[0];
console.log(part1Memory);
console.log("Part 1", part1Answer);
expect(part1Answer).toBe(2692315);

const getPart2Answer = (initialMemory: number[]) => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const part2InitialMemory = [...initialMemory];
      part2InitialMemory[1] = noun;
      part2InitialMemory[2] = verb;

      const part2Memory = runUntilCompletion(part2InitialMemory);

      if (part2Memory.memory[0] === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
};

const part2Answer = getPart2Answer(initialMemory);
console.log("Part 2", part2Answer);
expect(part2Answer).toBe(9507);
