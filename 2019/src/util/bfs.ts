export type Graph = Record<string, Set<string>>;

export function bfs(graph: Graph, start: string) {
  const queue: [string, number][] = [[start, -1]];
  const visited = new Set();
  const distances: Record<string, number> = {};

  while (queue.length) {
    const [vertex, dist] = queue.shift()!;

    if (!visited.has(vertex)) {
      visited.add(vertex);
      distances[vertex] = dist + 1;

      for (const neighbor of graph[vertex]) {
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return distances;
}
