import { isPasswordValid } from "./funcs.ts";

const start = 172930;
const end = 683082;

const validPasswords: number[] = [];
for (let i = start; i <= end; i++) {
  if (isPasswordValid(i)) {
    validPasswords.push(i);
  }
}

console.log("Part 1", validPasswords.length);

const validPasswordsWithExactlyTwoAdjacent: number[] = [];
for (let i = start; i <= end; i++) {
  if (isPasswordValid(i, { exactlyTwoAdjacentDigits: true })) {
    validPasswordsWithExactlyTwoAdjacent.push(i);
  }
}

console.log("Part 2", validPasswordsWithExactlyTwoAdjacent.length);
