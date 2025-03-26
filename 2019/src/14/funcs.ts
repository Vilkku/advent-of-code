import { inputToRows, toInt } from "../util/input.ts";

interface ChemicalAndAmount {
  chemical: string;
  amount: number;
}

export interface Reaction {
  input: ChemicalAndAmount[];
  output: ChemicalAndAmount;
}

export function parseReactions(reactionsStr: string): Reaction[] {
  return inputToRows(reactionsStr).map((row) => {
    const [inputs, output] = row.split(" => ");

    return {
      input: inputs.split(", ").map(parseChemicalAndAmount),
      output: parseChemicalAndAmount(output),
    };
  });
}

function parseChemicalAndAmount(
  chemicalAndAmountStr: string,
): ChemicalAndAmount {
  const [amountStr, chemical] = chemicalAndAmountStr.split(" ");
  const amount = toInt(amountStr);

  return {
    chemical,
    amount,
  };
}

export function getRequiredOre(
  reactions: Reaction[],
  desiredOutput: ChemicalAndAmount = { chemical: "FUEL", amount: 1 },
  spares: Record<string, number> = {}, // Spares is intentionally being mutated
): number {
  const reaction = reactions.find(
    (reaction) => reaction.output.chemical === desiredOutput.chemical,
  );

  if (!reaction) {
    throw new Error(
      `Could not find reaction producing ${desiredOutput.chemical}`,
    );
  }

  let amountNeeded = desiredOutput.amount;
  const availableFromSpares = Math.min(
    spares[desiredOutput.chemical] ?? 0,
    amountNeeded,
  );

  if (availableFromSpares > 0) {
    spares[desiredOutput.chemical] -= availableFromSpares;
    amountNeeded -= availableFromSpares;
  }

  let numReactionsNeeded = Math.ceil(amountNeeded / reaction.output.amount);

  if (numReactionsNeeded === 0) {
    return 0;
  }

  const totalProduced = numReactionsNeeded * reaction.output.amount;
  const excess = totalProduced - amountNeeded;
  if (excess > 0) {
    spares[desiredOutput.chemical] =
      (spares[desiredOutput.chemical] ?? 0) + excess;
  }

  if (reaction.input.length === 1 && reaction.input[0].chemical === "ORE") {
    return numReactionsNeeded * reaction.input[0].amount;
  }

  return reaction.input.reduce((sum, { chemical, amount }) => {
    const totalAmountNeeded = amount * numReactionsNeeded;
    const requiredOre = getRequiredOre(
      reactions,
      { chemical, amount: totalAmountNeeded },
      spares,
    );
    return sum + requiredOre;
  }, 0);
}
