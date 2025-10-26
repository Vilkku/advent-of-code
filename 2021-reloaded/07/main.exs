import ExUnit.Assertions

input = File.read!("input.txt")
example_input = "16,1,2,0,4,2,7,1,2,14"

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
      average = round(Enum.sum(values) / length(values))

      values
      |> Enum.map(fn crab ->
        dist = abs(crab - average)
        Enum.sum(1..dist)
      end)
      |> Enum.sum()
    end
  end
end

part1Answer = Day7.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 340_987

part2Answer = Day7.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 1_604_361_182_149
