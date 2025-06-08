export type WeightedGraph = Record<string, Record<string, number>>;

export function dijkstra(
  graph: WeightedGraph,
  start: string,
): Record<string, number> {
  const distances: Record<string, number> = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  nodes.forEach((node) => (distances[node] = Infinity));
  distances[start] = 0;

  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    let closestNode = nodes.shift()!;

    if (distances[closestNode] === Infinity) {
      break;
    }

    visited.add(closestNode);

    for (let neighbor in graph[closestNode]) {
      if (!visited.has(neighbor)) {
        let newDistance = distances[closestNode] + graph[closestNode][neighbor];

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
        }
      }
    }
  }

  return distances;
}
