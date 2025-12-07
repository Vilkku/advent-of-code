import ExUnit.Assertions

input = File.read!("input.txt")
example_input = "dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
"

defmodule Day12 do
  def parse_input(input) do
    graph =
      input
      |> String.trim()
      |> String.split("\n", trim: true)
      |> Enum.reduce(%{}, fn line, graph ->
        [a, b] = String.split(line, "-")

        graph
        |> Map.update(a, [b], &[b | &1])
        |> Map.update(b, [a], &[a | &1])
      end)

    graph
    |> Map.delete("end")
    |> Enum.map(fn {k, neighbors} ->
      {k, Enum.reject(neighbors, &(&1 == "start"))}
    end)
    |> Map.new()
  end

  defmodule Part1 do
    def solve(input) do
      graph =
        input
        |> Day12.parse_input()

      get_paths(graph, "start", ["start"], MapSet.new())
      |> length()
    end

    defp get_paths(_graph, "end", current_path, _visited) do
      [Enum.reverse(current_path)]
    end

    defp get_paths(graph, current_position, current_path, visited) do
      neighbors = Map.get(graph, current_position, [])

      neighbors
      |> Enum.reject(fn destination -> destination in visited end)
      |> Enum.flat_map(fn destination ->
        visited_updated =
          if destination == String.upcase(destination) do
            visited
          else
            MapSet.put(visited, destination)
          end

        get_paths(
          graph,
          destination,
          [destination | current_path],
          visited_updated
        )
      end)
    end
  end

  defmodule Part2 do
    def solve(input) do
      graph =
        input
        |> Day12.parse_input()

      get_paths(graph, "start", ["start"], %{}, false)
      |> length()
    end

    defp get_paths(_graph, "end", current_path, _visited_counts, _double_used) do
      [Enum.reverse(current_path)]
    end

    defp get_paths(graph, current_position, current_path, visited_counts, double_used) do
      neighbors = Map.get(graph, current_position, [])

      neighbors
      |> Enum.flat_map(fn destination ->
        cond do
          destination == String.upcase(destination) ->
            new_visited = visited_counts

            get_paths(
              graph,
              destination,
              [destination | current_path],
              new_visited,
              double_used
            )

          Map.get(visited_counts, destination, 0) == 0 ->
            new_visited = Map.update(visited_counts, destination, 1, &(&1 + 1))

            get_paths(
              graph,
              destination,
              [destination | current_path],
              new_visited,
              double_used
            )

          Map.get(visited_counts, destination, 0) === 1 and not double_used ->
            new_visited = Map.update(visited_counts, destination, 1, &(&1 + 1))

            get_paths(
              graph,
              destination,
              [destination | current_path],
              new_visited,
              true
            )

          true ->
            []
        end
      end)
    end
  end
end

part1Answer = Day12.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 3495

part2Answer = Day12.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part1Answer == 94849
