import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";

type Direction = "north" | "south" | "east" | "west";
export type Command = Direction | `take ${string}` | `drop ${string}` | "inv";

interface RoomOutput {
  type: "room";
  title: string;
  description: string;
  doors: Direction[];
  items: string[];
}

interface StatusOutput {
  type: "error" | "info";
  description: string;
}

type Output = RoomOutput | StatusOutput;

function commandToAscii(command: Command): number[] {
  const ASCII_NEWLINE = 10;
  const asciiCommand = command.split("").map((c) => c.charCodeAt(0));

  return [...asciiCommand, ASCII_NEWLINE];
}

function asciiToString(ascii: number[]): string {
  return ascii.map((charCode) => String.fromCharCode(charCode)).join("");
}

function parseOutput(output: string): Output[] {
  console.log(output);

  return output
    .trim()
    .split(/\n\n\n\n/)
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .flatMap((section) => {
      const titleDescriptionMatches = section.match(
        /== ([\w .,?!';\-:]+) ==\n([\w .,?!';\-:]+)/m,
      );

      if (!titleDescriptionMatches) {
        return {
          type: section === "You cannot go there" ? "error" : "info",
          description: section,
        };
      }

      const weightCheckMatches = section.match(
        /(A loud, robotic voice says.*)$/m,
      );

      if (weightCheckMatches) {
        return {
          type: "error",
          description: weightCheckMatches![1],
        };
      }

      const doorsMatches = section.match(
        /^Doors here lead:((?:\n- [\w .,?!';\-]+)+)/m,
      );
      const itemsMatches = section.match(
        /^Items here:((?:\n- [\w .,?!';\-:]+)+)/m,
      );

      return {
        type: "room",
        title: titleDescriptionMatches![1],
        description: titleDescriptionMatches![2],
        doors:
          doorsMatches?.[1]
            ?.split("\n- ")
            .filter((s): s is Direction => s !== "") ?? [],
        items: itemsMatches?.[1]?.split("\n- ").filter((s) => s !== "") ?? [],
      };
    });
}

function parseInventory(inventory: string): string[] {
  return inventory
    .trim()
    .split("\n")
    .map((s) => s.trim())
    .filter(
      (s) =>
        s !== "" &&
        s !== "Command?" &&
        s !== "Items in your inventory:" &&
        s !== "You aren't carrying any items.",
    )
    .map((s) => {
      return s.replace("- ", "");
    });
}

export async function run(
  initialMemory: number[],
  {
    onInput,
  }: {
    onInput: (outputs: Output[], inventory: string[]) => Promise<Command>;
  },
): Promise<number[]> {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  let output: number[] = [];

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        output.push(computerStatus.output);
        computerStatus = computer.run();
        break;
      case "input":
        const invOutput: number[] = [];
        const invCommandAscii = commandToAscii("inv");
        invCommandAscii.forEach((char) => computer.enqueueInput(char));
        computerStatus = computer.run();

        while (computerStatus.status === "output") {
          invOutput.push(computerStatus.output);
          computerStatus = computer.run();
        }

        const nextCommand = await onInput(
          parseOutput(asciiToString(output)),
          parseInventory(asciiToString(invOutput)),
        );

        const nextCommandAscii = commandToAscii(nextCommand);
        nextCommandAscii.forEach((char) => computer.enqueueInput(char));
        computerStatus = computer.run();
        break;
    }
  }

  await onInput(
    parseOutput(asciiToString(output)),
    parseInventory(asciiToString([])),
  );

  throw new Error(`Done! ${asciiToString(output)}`);
}
