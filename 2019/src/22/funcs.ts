import { inputToRows, toInt } from "../util/input.ts";

interface ReverseInstruction {
  type: "reverse";
}

interface DealInstruction {
  type: "deal";
  increment: number;
}

interface CutInstruction {
  type: "cut";
  cut: number;
}

type Instruction = ReverseInstruction | DealInstruction | CutInstruction;

type Deck = number[];

export function parseInstructions(input: string): Instruction[] {
  return inputToRows(input).map((row) => {
    const parts = row.split(" ");

    if (parts[0] === "deal") {
      if (parts[parts.length - 1] === "stack") {
        return {
          type: "reverse",
        };
      } else {
        return {
          type: "deal",
          increment: toInt(parts[parts.length - 1]),
        };
      }
    }

    if (parts[0] === "cut") {
      return {
        type: "cut",
        cut: toInt(parts[parts.length - 1]),
      };
    }

    throw new Error(`Unknown type "${parts[0]}"`);
  });
}

export function doReverseInstruction(initialDeck: Deck): Deck {
  return [...initialDeck].reverse();
}

export function doDealInstruction(
  initialDeck: Deck,
  instruction: DealInstruction,
): Deck {
  const nextDeck = new Array(initialDeck.length);

  let n = 0;
  for (let i = 0; i < initialDeck.length; i++) {
    nextDeck[n] = initialDeck[i];

    n += instruction.increment;

    if (n >= nextDeck.length) {
      n -= nextDeck.length;
    }
  }

  return nextDeck;
}

export function doCutInstruction(
  initialDeck: Deck,
  instruction: CutInstruction,
): Deck {
  const nextDeck = [...initialDeck];

  if (instruction.cut >= 0) {
    const cut = nextDeck.splice(0, instruction.cut);
    return [...nextDeck, ...cut];
  } else {
    const cut = nextDeck.splice(nextDeck.length + instruction.cut);
    return [...cut, ...nextDeck];
  }
}

export function doInstructionsOnFactoryDeck(instructions: Instruction[]): Deck {
  let currentDeck = Array.from(Array(10007).keys());

  instructions.forEach((instruction) => {
    switch (instruction.type) {
      case "reverse":
        currentDeck = doReverseInstruction(currentDeck);
        break;
      case "deal":
        currentDeck = doDealInstruction(currentDeck, instruction);
        break;
      case "cut":
        currentDeck = doCutInstruction(currentDeck, instruction);
        break;
      default:
        throw new Error(`Unhandled instruction ${instruction}`);
    }
  });

  return currentDeck;
}
