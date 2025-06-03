import { inputToRows } from "../util/input.ts";
import type { Graph } from "../util/dijkstra.ts";

export function parsePlutoMap(input: string): {
  graph: Graph;
  start: string;
  end: string;
} {
  const rows = inputToRows(input);
  const graph: Graph = {};
  const portals: Record<string, string[]> = {};
  const DISTANCE = 1;
  let start: string | undefined = undefined;
  let end: string | undefined = undefined;

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === ".") {
        const nodeId = getNodeId(x, y);
        const neighbors: Record<string, number> = {};

        [
          [y - 1, x],
          [y + 1, x],
          [y, x - 1],
          [y, x + 1],
        ].forEach(([neighborY, neighborX]) => {
          if (rows[neighborY] && rows[neighborY][neighborX]) {
            if (rows[neighborY][neighborX] === ".") {
              const neighborNodeId = getNodeId(neighborX, neighborY);
              neighbors[neighborNodeId] = DISTANCE;
            } else if (rows[neighborY][neighborX].match(/[A-Z]/)) {
              const portalId = getPortalId(rows, x, y, neighborX, neighborY);

              if (portalId === "AA") {
                start = nodeId;
              } else if (portalId === "ZZ") {
                end = nodeId;
              } else {
                if (!portals[portalId]) {
                  portals[portalId] = [];
                }

                portals[portalId].push(nodeId);
              }
            }
          }
        });

        graph[nodeId] = neighbors;
      }
    }
  }

  if (!start) {
    throw new Error("Did not find start");
  }

  if (!end) {
    throw new Error("Did not find end");
  }

  Object.entries(portals).forEach(([portalId, nodes]) => {
    if (nodes.length !== 2) {
      throw new Error(`Invalid portal ${portalId} with contents ${nodes}`);
    }

    graph[nodes[0]][nodes[1]] = DISTANCE;
    graph[nodes[1]][nodes[0]] = DISTANCE;
  });

  return { graph, start, end };
}

function getPortalId(
  rows: string[],
  x: number,
  y: number,
  neighborX: number,
  neighborY: number,
): string {
  if (neighborX < x && rows[y][neighborX - 1]) {
    return `${rows[y][neighborX - 1]}${rows[y][neighborX]}`;
  }

  if (neighborX > x && rows[y][neighborX + 1]) {
    return `${rows[y][neighborX]}${rows[y][neighborX + 1]}`;
  }

  if (neighborY < y && rows[neighborY - 1][x]) {
    return `${rows[neighborY - 1][x]}${rows[neighborY][x]}`;
  }

  if (neighborY > y && rows[neighborY + 1][x]) {
    return `${rows[neighborY][x]}${rows[neighborY + 1][x]}`;
  }

  throw new Error("Could not form portal ID");
}

function getNodeId(x: number, y: number): string {
  return `${x},${y}`;
}
