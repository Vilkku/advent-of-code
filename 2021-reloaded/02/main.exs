import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day2 do
  def part1(input) do
    input
    |> parse_input
    |> Enum.reduce({0, 0}, fn
      {"forward", n}, {pos, depth} -> {pos + n, depth}
      {"down", n}, {pos, depth} -> {pos, depth + n}
      {"up", n}, {pos, depth} -> {pos, depth - n}
    end)
    |> then(fn {pos, depth} -> pos * depth end)
  end

  def part2(input) do
    input
    |> parse_input
    |> Enum.reduce({0, 0, 0}, fn
      {"forward", n}, {pos, depth, aim} -> {pos + n, depth + aim * n, aim}
      {"down", n}, {pos, depth, aim} -> {pos, depth, aim + n}
      {"up", n}, {pos, depth, aim} -> {pos, depth, aim - n}
    end)
    |> then(fn {pos, depth, _aim} -> pos * depth end)
  end

  defp parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line ->
      [cmd, val] = String.split(line, " ", parts: 2)
      {cmd, String.to_integer(val)}
    end)
  end
end

part1Answer = Day2.part1(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 1_694_130

part2Answer = Day2.part2(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 1_698_850_445
