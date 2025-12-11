import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const exampleInput = `[######..] (0,1,2,3,4,5) (0,4,5,7) (1,5,7) (3,4,6) (2,6,7) (0,5,7) (2,3,4,7) (5,6,7) (1,3,4,5,6) (1,3,4) {31,51,38,61,77,74,49,72}
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

printAnswer("Part 2", () => {
  const machines = exampleInput
    .trim()
    .split("\n")
    .map((row) => {
      const matches = [...row.matchAll(/\(([^)]+)\)|\{([^\}]+)\}/g)];
      let joltages: null | string = null;
      const buttons: string[] = [];

      for (const match of matches) {
        if (match[2]) {
          joltages = match[2].trim();
        } else if (match[1]) {
          buttons.push(match[1].trim());
        }
      }

      if (!joltages) {
        throw new Error("Joltages not found");
      }

      return {
        endState: joltages.split(",").map((s) => parseInt(s, 10)),
        buttons: buttons.map((button) =>
          button.split(",").map((n) => parseInt(n, 10)),
        ),
      };
    });

  const generateKey = (arr: number[]) => arr.join(",");
  const parseState = (key: string) =>
    key.split(",").map((n) => parseInt(n, 10));

  return machines.reduce((sum, machine) => {
    const endStateKey = generateKey(machine.endState);
    let presses = 0;
    let states = new Set([generateKey(machine.endState.map((_n) => 0))]);

    while (!states.has(endStateKey)) {
      presses++;
      console.log(presses);
      const newStates: Set<string> = new Set();

      stateLoop: for (const stateKey of states) {
        const state = parseState(stateKey);

        buttonLoop: for (const button of machine.buttons) {
          const newState = [...state];

          for (const n of button) {
            newState[n]!++;

            if (newState[n]! > machine.endState[n]!) {
              continue buttonLoop;
            }
          }

          const newStateKey = generateKey(newState);

          newStates.add(newStateKey);

          if (newStateKey === endStateKey) {
            break stateLoop;
          }
        }
      }

      states = newStates;
    }

    return sum + presses;
  }, 0);
});
