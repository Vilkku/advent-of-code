import { getInput } from "../util/input.ts";
import { printAnswer } from "../util/benchmark.ts";
import { doInstructionsOnFactoryDeck, parseInstructions } from "./funcs.ts";

const input = await getInput(import.meta.dir, "input.txt");

printAnswer(
  "Part 1",
  () => {
    const instructions = parseInstructions(input);
    const deckAfterInstructions = doInstructionsOnFactoryDeck(instructions);

    return deckAfterInstructions.indexOf(2019);
  },
  7171,
);
