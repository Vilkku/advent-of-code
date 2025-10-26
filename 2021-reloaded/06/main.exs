import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day6 do
  @days_p1 80
  @days_p2 256

  defp parse_input(input) do
    input
    |> String.trim()
    |> String.split(",", trim: true)
    |> Enum.map(&String.to_integer/1)
  end

  defp evolve(0), do: [6, 8]
  defp evolve(t), do: [t - 1]

  defp simulate_step(timers), do: Enum.flat_map(timers, &evolve/1)

  defp simulate(timers, 0), do: timers
  defp simulate(timers, days), do: timers |> simulate_step() |> simulate(days - 1)

  def part1(input) do
    input
    |> parse_input()
    |> simulate(@days_p1)
    |> length()
  end

  defp get_initial_counts(values) do
    freq = Enum.frequencies(values)
    for i <- 0..8, do: Map.get(freq, i, 0)
  end

  defp simulate_list_step([c0, c1, c2, c3, c4, c5, c6, c7, c8]) do
    [c1, c2, c3, c4, c5, c6, c7 + c0, c8, c0]
  end

  defp simulate_list(counts, 0), do: counts
  defp simulate_list(counts, days), do: counts |> simulate_list_step() |> simulate_list(days - 1)

  def part2(input) do
    input
    |> parse_input()
    |> get_initial_counts()
    |> simulate_list(@days_p2)
    |> Enum.sum()
  end
end

part1Answer = Day6.part1(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 352_872

part2Answer = Day6.part2(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 1_604_361_182_149
