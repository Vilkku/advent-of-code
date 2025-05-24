import { expect, test } from "bun:test";
import {
  createDoorNode,
  createFloorNode,
  createKeyNode,
  fewestSteps,
  parseVault,
  type Vault,
} from "./funcs.ts";

const example1 = `#########
#b.A.@.a#
#########
`;

const example2 = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################
`;

const example1Vault: Vault = {
  "1,1": createKeyNode(1, 1, "b", ["2,1"]),
  "2,1": createFloorNode(2, 1, ["3,1", "1,1"]),
  "3,1": createDoorNode(3, 1, "a", ["4,1", "2,1"]),
  "4,1": createFloorNode(4, 1, ["5,1", "3,1"]),
  "5,1": createFloorNode(5, 1, ["6,1", "4,1"]),
  "6,1": createFloorNode(6, 1, ["7,1", "5,1"]),
  "7,1": createKeyNode(7, 1, "a", ["6,1"]),
};

test("parseVault", () => {
  expect(parseVault(example1)).toEqual({
    vault: example1Vault,
    startPosition: "5,1",
  });
});

test("fewestSteps", () => {
  expect(fewestSteps(example1Vault, "5,1", new Set<string>())).toBe(8);

  const { vault: example2Vault, startPosition: example2StartPosition } =
    parseVault(example2);

  expect(
    fewestSteps(example2Vault, example2StartPosition, new Set<string>()),
  ).toBe(86);
});
