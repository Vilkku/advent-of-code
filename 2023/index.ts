import { part1, part2 } from "./src/4";

const file = Bun.file("./inputs/4.txt");
const input = await file.text();

console.log([part1(input), part2(input)]);
