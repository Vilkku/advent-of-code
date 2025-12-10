import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`;

printAnswer(
  "Part 1",
  () => {
    const machines = input
      .trim()
      .split("\n")
      .map((row) => {
        const matches = [...row.matchAll(/\[([^\]]+)\]|\(([^)]+)\)/g)];
        let indicatorLights: null | string = null;
        const buttons: string[] = [];

        for (const match of matches) {
          if (match[1]) {
            indicatorLights = match[1].trim();
          } else if (match[2]) {
            buttons.push(match[2].trim());
          }
        }

        if (!indicatorLights) {
          throw new Error("Indicator lights not found");
        }

        return {
          endState: parseInt(
            indicatorLights
              .split("")
              .map((s) => (s === "#" ? "1" : "0"))
              .join(""),
            2,
          ),
          buttons: buttons.map((button) => {
            const numbers = button.split(",").map((n) => parseInt(n, 10));
            const result: string[] = [];

            for (let i = 0; i < indicatorLights.length; i++) {
              if (numbers.includes(i)) {
                result.push("1");
              } else {
                result.push("0");
              }
            }

            return parseInt(result.join(""), 2);
          }),
        };
      });

    return machines.reduce((sum, machine) => {
      let presses = 0;
      let states = new Set([0]);

      while (!states.has(machine.endState)) {
        presses++;
        const newStates: Set<number> = new Set();

        stateLoop: for (const state of states) {
          for (const button of machine.buttons) {
            const newState = state ^ button;

            newStates.add(state ^ button);

            if (newState === machine.endState) {
              break stateLoop;
            }
          }
        }

        states = newStates;
      }

      return sum + presses;
    }, 0);
  },
  404,
);
