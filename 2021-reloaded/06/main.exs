import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day6 do
  defp parse_input(input) do
    input
    |> String.trim()
    |> String.split(",", trim: true)
    |> Enum.map(&String.to_integer/1)
  end

  defp simulate_step(initial_step) do
    initial_step
    |> Enum.flat_map(fn timer ->
      if timer > 0, do: [timer - 1], else: [6, 8]
    end)
  end

  def part1(input) do
    values = parse_input(input)

    1..80
    |> Enum.reduce(values, fn _, acc -> simulate_step(acc) end)
    |> length()
  end

  defp get_initial_counts(values) do
    freq = Enum.frequencies(values)
    for i <- 0..8, do: Map.get(freq, i, 0)
  end

  defp step([c0, c1, c2, c3, c4, c5, c6, c7, c8]) do
    [c1, c2, c3, c4, c5, c6, c7 + c0, c8, c0]
  end

  defp simulate_list(counts, 0), do: counts
  defp simulate_list(counts, days), do: counts |> step() |> simulate_list(days - 1)

  def part2(input) do
    input
    |> parse_input()
    |> get_initial_counts()
    |> simulate_list(256)
    |> Enum.sum()
  end
end

part1Answer = Day6.part1(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 352_872

part2Answer = Day6.part2(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 1_604_361_182_149
