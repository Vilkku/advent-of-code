import { benchmark } from "../util/benchmark.ts";
import { isPasswordValid } from "./funcs.ts";

const start = 172930;
const end = 683082;

benchmark(() => {
  const validPasswords: number[] = [];
  for (let i = start; i <= end; i++) {
    if (isPasswordValid(i)) {
      validPasswords.push(i);
    }
  }

  console.log("Part 1", validPasswords.length);
}, "Part 1");

benchmark(() => {
  const validPasswordsWithExactlyTwoAdjacent: number[] = [];
  for (let i = start; i <= end; i++) {
    if (isPasswordValid(i, { exactlyTwoAdjacentDigits: true })) {
      validPasswordsWithExactlyTwoAdjacent.push(i);
    }
  }

  console.log("Part 2", validPasswordsWithExactlyTwoAdjacent.length);
}, "Part 2");
