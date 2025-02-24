import { getInput, inputToRows } from "../util/input";

const map = inputToRows(await getInput(import.meta.dir, "input.txt")).map((s) =>
  s.split(""),
);
