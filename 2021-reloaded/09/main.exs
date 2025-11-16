import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day9 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split("\n", trim: true)
    |> Enum.map(fn row ->
      String.split(row, "", trim: true)
      |> Enum.map(&String.to_integer/1)
    end)
  end

  def make_get_point(values) do
    row_count = length(values)
    col_count = length(Enum.at(values, 0, []))

    fn row, col ->
      cond do
        row < 0 or col < 0 -> 10
        row >= row_count or col >= col_count -> 10
        true -> Enum.at(Enum.at(values, row), col)
      end
    end
  end

  def get_low_points(values) do
    get_point = Day9.make_get_point(values)

    values
    |> Enum.with_index()
    |> Enum.flat_map(fn {row, rowIndex} ->
      row
      |> Enum.with_index()
      |> Enum.filter(fn {point, pointIndex} ->
        get_point.(rowIndex - 1, pointIndex) > point &&
          get_point.(rowIndex + 1, pointIndex) > point &&
          get_point.(rowIndex, pointIndex - 1) > point &&
          get_point.(rowIndex, pointIndex + 1) > point
      end)
      |> Enum.map(fn {point, pointIndex} -> {point, {rowIndex, pointIndex}} end)
    end)
  end

  defmodule Part1 do
    def solve(input) do
      Day9.parse_input(input)
      |> Day9.get_low_points()
      |> Enum.map(fn {point, _} ->
        point + 1
      end)
      |> Enum.sum()
    end
  end

  defmodule Part2 do
    def get_connected_points(values, {point, {row, col}}) do
      get_connected_points(values, {point, {row, col}}, MapSet.new())
    end

    defp get_connected_points(values, {point, {row, col}}, visited) do
      if MapSet.member?(visited, {row, col}) or point >= 9 do
        {0, visited}
      else
        visited = MapSet.put(visited, {row, col})
        get_point = Day9.make_get_point(values)

        neighbors = [
          {row - 1, col},
          {row + 1, col},
          {row, col - 1},
          {row, col + 1}
        ]

        valid_neighbors =
          neighbors
          |> Enum.map(fn {r, c} -> {get_point.(r, c), {r, c}} end)
          |> Enum.filter(fn {p, {_r, _c}} -> p > point and p < 9 end)

        {count_acc, visited} =
          Enum.reduce(valid_neighbors, {0, visited}, fn neighbor, {acc, vis} ->
            {found_count, vis_after} = get_connected_points(values, neighbor, vis)
            {acc + found_count, vis_after}
          end)

        {1 + count_acc, visited}
      end
    end

    def solve(input) do
      values = Day9.parse_input(input)

      values
      |> Day9.get_low_points()
      |> Enum.map(fn p -> get_connected_points(values, p) end)
      |> Enum.map(fn {count, _visited} -> count end)
      |> Enum.sort(:desc)
      |> Enum.take(3)
      |> Enum.reduce(1, fn x, acc -> x * acc end)
    end
  end
end

part1Answer = Day9.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 594

part2Answer = Day9.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 858_494
