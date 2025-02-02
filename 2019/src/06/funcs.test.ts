import { expect, test } from "bun:test";
import {
  getOrbitTree,
  getOrbitCount,
  getParents,
  getClosestCommonParent,
  getStepsFromAtoB,
} from "./funcs.ts";
import { inputToRows } from "../util/input.ts";

const orbitMap1 = inputToRows(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`).map((row) => row.split(")") as [string, string]);
const orbitTree1 = getOrbitTree(orbitMap1);

const orbitMap2 = inputToRows(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`).map((row) => row.split(")") as [string, string]);
const orbitTree2 = getOrbitTree(orbitMap2);

test("getOrbitCount", () => {
  expect(getOrbitCount(orbitTree1, "COM")).toBe(42);
});

test("getParents", () => {
  expect(getParents(orbitTree1, "L")).toMatchObject([
    "K",
    "J",
    "E",
    "D",
    "C",
    "B",
    "COM",
  ]);

  expect(getParents(orbitTree1, "I")).toMatchObject(["D", "C", "B", "COM"]);
});

test("getClosestCommonParent", () => {
  expect(
    getClosestCommonParent(
      ["K", "J", "E", "D", "C", "B", "COM"],
      ["D", "C", "B", "COM"],
    ),
  ).toBe("D");
});

test("getStepsFromAtoB", () => {
  expect(getStepsFromAtoB(orbitTree2, "YOU", "SAN")).toBe(4);
});
