import { expect, test } from "bun:test";
import {
  createDoorNode,
  createFloorNode,
  createKeyNode,
  getClosestKey,
  getNumberOfStepsByGoingToClosestKey,
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

const example2DorE = `########################
#f.D.E.e.............@.#
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

test("getClosestKey", () => {
  const keyInventory = new Set<string>();

  expect(getClosestKey({ ...example1Vault }, "5,1", keyInventory)).toEqual({
    node: createKeyNode(7, 1, "a", expect.any(Array)),
    distance: 2,
  });

  expect(keyInventory).toEqual(new Set("a"));

  expect(
    getClosestKey(
      { ...example1Vault, "7,1": createFloorNode(7, 1, ["6,1"]) },
      "7,1",
      keyInventory,
    ),
  ).toEqual({ node: createKeyNode(1, 1, "b", expect.any(Array)), distance: 6 });

  expect(keyInventory).toEqual(new Set("b"));

  expect(
    getClosestKey(
      {
        ...example1Vault,
        "1,1": createFloorNode(1, 1, ["2,1"]),
        "7,1": createFloorNode(7, 1, ["6,1"]),
      },
      "1,1",
      keyInventory,
    ),
  ).toBe(null);

  expect(keyInventory).toEqual(new Set("b"));
});

test.only("getClosestKey D or E", () => {
  const { vault, startPosition } = parseVault(example2DorE);
  const keyInventory = new Set<string>();

  expect(
    getClosestKey(
      {
        ...vault,
      },
      startPosition,
      keyInventory,
    ),
  ).toBe({
    node: {
      type: "key",
      x: expect.any(Number),
      y: expect.any(Number),
      key: "d",
      links: expect.any(Array),
    },
    distance: expect.any(Number),
  });

  expect(keyInventory).toEqual(new Set("d"));
});

test("getNumberOfStepsByGoingToClosestKey", () => {
  expect(getNumberOfStepsByGoingToClosestKey({ ...example1Vault }, "5,1")).toBe(
    8,
  );

  const { vault: example2Vault, startPosition: example2StartPosition } =
    parseVault(example2);

  expect(
    getNumberOfStepsByGoingToClosestKey(
      { ...example2Vault },
      example2StartPosition,
    ),
  ).toBe(86);
});
