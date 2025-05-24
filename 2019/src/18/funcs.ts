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

interface KeyNodeAndDistance {
  node: KeyNode;
  distance: number;
}

function getReachableKeys(
  vault: Vault,
  start: string,
  inventory: Set<string>,
): KeyNodeAndDistance[] {
  const queue: [string, number][] = [[start, 0]];
  const visited = new Set<string>([start]);
  const results: KeyNodeAndDistance[] = [];

  while (queue.length) {
    const [loc, dist] = queue.shift()!;

    for (const nbr of vault[loc].links) {
      if (visited.has(nbr)) continue;
      visited.add(nbr);

      const node = vault[nbr]!;
      if (node.type === "door" && !inventory.has(node.door)) {
        continue;
      }

      if (node.type === "key") {
        results.push({ node, distance: dist + 1 });
      }

      queue.push([nbr, dist + 1]);
    }
  }

  return results;
}

function stateId(loc: string, inventory: Set<string>) {
  return loc + "|" + [...inventory].sort().join(",");
}

export function fewestSteps(
  vault: Vault,
  loc: string,
  inventory: Set<string>,
  memo = new Map<string, number>(),
): number {
  const id = stateId(loc, inventory);
  if (memo.has(id)) {
    return memo.get(id)!;
  }

  // 1) which keys can I grab next?
  const nextKeys = getReachableKeys(vault, loc, inventory);
  if (nextKeys.length === 0) {
    // no more reachable keys
    return 0;
  }

  // 2) try each branch, pick the min
  let best = Infinity;
  for (const { node, distance } of nextKeys) {
    // a) clone inventory + vault map
    const inv2 = new Set(inventory);
    inv2.add(node.key);

    const keyPos = `${node.x},${node.y}`;
    const vault2: Vault = { ...vault };
    // replace that key-node with a floor-node
    vault2[keyPos] = createFloorNode(node.x, node.y, node.links);

    // b) recurse from the new location
    const future = fewestSteps(vault2, keyPos, inv2, memo);

    best = Math.min(best, distance + future);
  }

  memo.set(id, best);
  return best;
}
