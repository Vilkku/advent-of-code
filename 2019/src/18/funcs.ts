import { inputToRows } from "../util/input.ts";

export interface Vault {
  currentPosition: string;
  nodes: Record<string, VaultNode>;
  keys: [];
}

type VaultNode = FloorNode | KeyNode | DoorNode;

interface BaseVaultNode {
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

export function parseVault(input: string): Vault {
  let currentPosition: string | undefined;
  const nodes: Record<string, VaultNode> = {};
  const rows = inputToRows(input);

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y].split("");

    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") {
        continue;
      }

      const node = parseNode(row[x]);

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
          node.links.push(`${linkX},${linkY}`);
        }
      });

      if (row[x] === "@") {
        currentPosition = `${x},${y}`;
      }

      nodes[`${x},${y}`] = node;
    }
  }

  if (!currentPosition) {
    throw new Error("Current position not set");
  }

  return {
    currentPosition,
    nodes,
    keys: [],
  };
}

function parseNode(char: string): VaultNode {
  // When parsing node assume @ represents a floor
  if (char === "." || char === "@") {
    return createFloorNode();
  }

  const charLowerCase = char.toLowerCase();

  if (char === charLowerCase) {
    return createKeyNode(charLowerCase);
  }

  return createDoorNode(charLowerCase);
}

export function createFloorNode(links: string[] = []): FloorNode {
  return { type: "floor", links };
}

export function createKeyNode(key: string, links: string[] = []): KeyNode {
  return { type: "key", key, links };
}

export function createDoorNode(door: string, links: string[] = []): DoorNode {
  return { type: "door", door, links };
}

export function bfs(nodes: Record<string, VaultNode>, start: string) {
  const queue = [start];
  const visited = new Set();
  const result = [];

  while (queue.length) {
    const vertex = queue.shift();

    if (vertex && !visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of nodes[vertex].links) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

export function dfs(nodes: Record<string, VaultNode>, start: string) {
  const stack = [start];
  const visited = new Set();
  const result = [];

  while (stack.length) {
    const vertex = stack.pop();

    if (vertex && !visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of nodes[vertex].links) {
        stack.push(neighbor);
      }
    }
  }

  return result;
}
