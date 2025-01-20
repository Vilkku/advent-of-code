export const isPasswordValid = (
  password: number,
  {
    exactlyTwoAdjacentDigits = false,
  }: { exactlyTwoAdjacentDigits?: boolean } = {},
): boolean => {
  const digits = password.toString().split("").map(Number);
  let hasTwoAdjacentDigits = false;

  for (let j = 1; j < digits.length; j++) {
    if (digits[j] < digits[j - 1]) {
      return false;
    }

    if (!hasTwoAdjacentDigits && digits[j] === digits[j - 1]) {
      if (
        !exactlyTwoAdjacentDigits ||
        ((j < 2 || digits[j - 2] !== digits[j]) &&
          (j === 5 || digits[j + 1] !== digits[j]))
      ) {
        hasTwoAdjacentDigits = true;
      }
    }
  }

  return hasTwoAdjacentDigits;
};
