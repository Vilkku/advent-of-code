import { inputToRows } from "../util/input.ts";

export type Vault = Record<string, VaultNode>;

type VaultNode = FloorNode | KeyNode | DoorNode;

interface BaseVaultNode {
  x: number;
  y: number;
  links: string[];
}

interface FloorNode extends BaseVaultNode {
  type: "floor";
}

interface KeyNode extends BaseVaultNode {
  type: "key";
  key: string;
}

interface DoorNode extends BaseVaultNode {
  type: "door";
  door: string;
}

function createNodeKey(x: number, y: number) {
  return `${x},${y}`;
}

export function parseVault(input: string): {
  startPosition: string;
  vault: Vault;
} {
  let currentPosition: string | undefined;
  const vault: Record<string, VaultNode> = {};
  const rows = inputToRows(input);

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y].split("");

    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") {
        continue;
      }

      const node = parseNode(row[x], x, y);

      [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
      ].forEach(([linkX, linkY]) => {
        if (
          linkX >= 0 &&
          linkY >= 0 &&
          linkX < row.length &&
          linkY < rows.length &&
          rows[linkY][linkX] !== "#"
        ) {
          node.links.push(createNodeKey(linkX, linkY));
        }
      });

      if (row[x] === "@") {
        currentPosition = createNodeKey(x, y);
      }

      vault[createNodeKey(x, y)] = node;
    }
  }

  if (!currentPosition) {
    throw new Error("Current position not set");
  }

  return {
    startPosition: currentPosition,
    vault,
  };
}

function parseNode(char: string, x: number, y: number): VaultNode {
  // When parsing node assume @ represents a floor
  if (char === "." || char === "@") {
    return createFloorNode(x, y);
  }

  const charLowerCase = char.toLowerCase();

  if (char === charLowerCase) {
    return createKeyNode(x, y, charLowerCase);
  }

  return createDoorNode(x, y, charLowerCase);
}

export function createFloorNode(
  x: number,
  y: number,
  links: string[] = [],
): FloorNode {
  return { type: "floor", x, y, links };
}

export function createKeyNode(
  x: number,
  y: number,
  key: string,
  links: string[] = [],
): KeyNode {
  return { type: "key", key, x, y, links };
}

export function createDoorNode(
  x: number,
  y: number,
  door: string,
  links: string[] = [],
): DoorNode {
  return { type: "door", door, x, y, links };
}

export function getClosestKey(
  vault: Vault,
  currentLocation: string,
  keyInventory: Set<string>,
): { node: KeyNode; distance: number } | null {
  const queue: [string, number][] = [[currentLocation, 0]];
  const visited = new Set();

  console.log(`Starting at ${currentLocation} with keys ${[...keyInventory]}`);

  while (queue.length) {
    const next = queue.shift();

    if (!next) {
      continue;
    }

    const [vertex, distance] = next;

    if (visited.has(vertex)) {
      continue;
    }

    visited.add(vertex);

    const node = vault[vertex];
    if (!node) {
      throw new Error(`${vertex} not found in nodes`);
    }

    if (node.type === "door") {
      if (keyInventory.has(node.door)) {
        console.log(`Opened door ${node.door}`);
        keyInventory.delete(node.door);
        vault[vertex] = createFloorNode(node.x, node.y, node.links);
      } else {
        console.log(`Cannot open door ${node.door}`);
        continue;
      }
    } else if (node.type === "key") {
      console.log(`Adding key ${node.key} to inventory`);
      keyInventory.add(node.key);
      vault[vertex] = createFloorNode(node.x, node.y, node.links);
      return { node, distance };
    }

    for (const neighbor of node.links) {
      if (!visited.has(neighbor)) {
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return null;
}

export function getNumberOfStepsByGoingToClosestKey(
  initialVault: Vault,
  startLocation: string,
): number {
  const keyInventory = new Set<string>();
  const vault: Vault = { ...initialVault };
  let currentLocation = startLocation;
  let steps = 0;
  let closestKey = getClosestKey(vault, currentLocation, keyInventory);

  while (closestKey !== null) {
    currentLocation = createNodeKey(closestKey.node.x, closestKey.node.y);
    steps += closestKey.distance;
    closestKey = getClosestKey(vault, currentLocation, keyInventory);
  }

  return steps;
}
