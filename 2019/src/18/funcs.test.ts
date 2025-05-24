import { expect, test } from "bun:test";
import {
  bfs,
  createDoorNode,
  createFloorNode,
  createKeyNode,
  dfs,
  parseVault,
  type Vault,
} from "./funcs.ts";

const example1 = `#########
#b.A.@.a#
#########
`;

const example1Vault: Vault = {
  currentPosition: "5,1",
  nodes: {
    "1,1": createKeyNode("b", ["2,1"]),
    "2,1": createFloorNode(["3,1", "1,1"]),
    "3,1": createDoorNode("a", ["4,1", "2,1"]),
    "4,1": createFloorNode(["5,1", "3,1"]),
    "5,1": createFloorNode(["6,1", "4,1"]),
    "6,1": createFloorNode(["7,1", "5,1"]),
    "7,1": createKeyNode("a", ["6,1"]),
  },
  keys: [],
};

test("parseVault", () => {
  expect(parseVault(example1)).toEqual(example1Vault);
});

test("bfs", () => {
  console.log(bfs(example1Vault.nodes, example1Vault.currentPosition));
});

test("dfs", () => {
  console.log(dfs(example1Vault.nodes, example1Vault.currentPosition));
});
