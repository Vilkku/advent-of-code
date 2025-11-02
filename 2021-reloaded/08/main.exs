import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day8 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split("\n", trim: true)
    |> Enum.map(fn row ->
      [left, right] = String.split(row, "|", parts: 2, trim: true)

      {String.split(left, " ", trim: true), String.split(right, " ", trim: true)}
    end)
  end

  defmodule Part1 do
    def solve(input) do
      Day8.parse_input(input)
      |> Enum.flat_map(fn {_, value} ->
        value
      end)
      |> Enum.count(fn str ->
        String.length(str) in [2, 3, 4, 7]
      end)
    end
  end
end

part1Answer = Day8.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 274
