export const part1 = (input: string) => {
  const numbers = input
    .split("\n")
    .map((line) => {
      const digits = line
        .trim()
        .split("")
        .map((char) => parseInt(char, 10))
        .filter((num) => !isNaN(num));

      return parseInt(`${digits.at(0)}${digits.at(-1)}`, 10);
    })
    .filter((num) => !isNaN(num));

  return numbers.reduce((acc, line) => acc + line, 0);
};

export const getPart2LineCalibrationDigits = (line: string) => {
  const spelledOutNumbers = {
    one: "one1one",
    two: "two2two",
    three: "three3three",
    four: "four4four",
    five: "five5five",
    six: "six6six",
    seven: "seven7seven",
    eight: "eight8eight",
    nine: "nine9nine",
  };

  let l = line;

  Object.entries(spelledOutNumbers).forEach(([key, value]) => {
    l = l.replaceAll(key, value);
  });

  const digits = l
    .split("")
    .map((char) => parseInt(char, 10))
    .filter((num) => !isNaN(num));

  return parseInt(`${digits.at(0)}${digits.at(-1)}`, 10);
};

export const part2 = (input: string) => {
  const numbers = input
    .split("\n")
    .map(getPart2LineCalibrationDigits)
    .filter((num) => !isNaN(num));

  return numbers.reduce((acc, line) => acc + line, 0);
};
