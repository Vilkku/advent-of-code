import { getInput } from "../util/input";
import { printAnswer } from "../util/benchmark";

const input = await getInput(import.meta.dir, "input.txt");
const part1ExampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`;
const part2ExampleInput = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`;

type MatchineMap = Map<string, string[]>;
function parseMachines(input: string): MatchineMap {
  const machines: MatchineMap = new Map();

  input
    .trim()
    .split("\n")
    .forEach((row) => {
      const [machine, outputsStr] = row.split(": ");
      const outputs = outputsStr!.split(" ");

      machines.set(machine!, outputs);
    });

  return machines;
}

printAnswer(
  "Part 1",
  () => {
    const machines = parseMachines(input);

    function getPath(
      machines: MatchineMap,
      machineId: string,
      path: string[],
    ): string[][] {
      if (machineId === "out") {
        return [[...path, "out"]];
      }

      const outputs = machines.get(machineId);

      return outputs!.flatMap((output) =>
        getPath(machines, output, [...path, machineId]),
      );
    }

    const paths = getPath(machines, "you", []);

    return paths.length;
  },
  634,
);

printAnswer(
  "Part 2",
  () => {
    const machines = parseMachines(input);

    function getPath(
      machines: MatchineMap,
      machineId: string,
      path: string[],
      goal: string,
    ): string[][] {
      if (machineId === goal) {
        return [[...path, goal]];
      }

      if (machineId === "out") {
        return [];
      }

      const outputs = machines.get(machineId);

      if (!outputs) {
        throw new Error(`Could not find "${machineId}"`);
      }

      const filteredOutputs = outputs!.includes("fft")
        ? ["fft"]
        : outputs!.includes("dac")
          ? ["dac"]
          : outputs;

      return filteredOutputs!.flatMap((output) => {
        const machinesWithoutOutput = new Map(machines);
        machinesWithoutOutput.set(
          machineId,
          filteredOutputs.filter((o) => o !== output),
        );
        return getPath(
          machinesWithoutOutput,
          output,
          [...path, machineId],
          goal,
        );
      });
    }

    const pathsFromFftToDac = getPath(machines, "svr", [], "out");

    console.log(pathsFromFftToDac);

    return pathsFromFftToDac.filter(
      (path) => path.includes("fft") && path.includes("dac"),
    ).length;
  },
  634,
);
