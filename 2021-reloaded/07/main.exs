import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day7 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split(",", trim: true)
    |> Enum.map(&String.to_integer/1)
  end

  def median(list) do
    sorted = Enum.sort(list)
    n = length(sorted)
    Enum.at(sorted, div(n - 1, 2))
  end

  def mean(list) do
    Enum.sum(list) / length(list)
  end

  defmodule Part1 do
    def solve(input) do
      values = Day7.parse_input(input)
      median = Day7.median(values)

      values
      |> Enum.map(&abs(&1 - median))
      |> Enum.sum()
    end
  end

  defmodule Part2 do
    def solve(input) do
      values = Day7.parse_input(input)
      mean = Day7.mean(values)

      [floor(mean), ceil(mean)]
      |> Enum.map(fn pos ->
        values
        |> Enum.map(fn crab ->
          dist = abs(crab - pos)
          Enum.sum(1..dist)
        end)
        |> Enum.sum()
      end)
      |> Enum.min()
    end
  end
end

part1Answer = Day7.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 340_987

part2Answer = Day7.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 96_987_874
