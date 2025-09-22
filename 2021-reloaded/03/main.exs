import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day3 do
  def part1(input) do
    values = parse_input(input)
    width = values |> List.first() |> length()
    initialAcc = List.duplicate({0, 0}, width)

    {most_list, least_list} =
      values
      |> Enum.reduce(initialAcc, fn row, acc ->
        Enum.zip(acc, row)
        |> Enum.map(fn
          {{z, o}, "0"} -> {z + 1, o}
          {{z, o}, "1"} -> {z, o + 1}
        end)
      end)
      |> Enum.map_reduce([], fn {z, o}, acc ->
        most = if o >= z, do: "1", else: "0"
        least = if o < z, do: "1", else: "0"
        {{most, least}, acc}
      end)
      |> elem(0)
      |> Enum.unzip()

    String.to_integer(Enum.join(most_list), 2) * String.to_integer(Enum.join(least_list), 2)
  end

  def part2(input) do
    values = parse_input(input)
    width = values |> List.first() |> length()
    initialAcc = List.duplicate({0, 0}, width)

    {most_list, least_list} =
      values
      |> Enum.reduce(initialAcc, fn row, acc ->
        Enum.zip(acc, row)
        |> Enum.map(fn
          {{z, o}, "0"} -> {z + 1, o}
          {{z, o}, "1"} -> {z, o + 1}
        end)
      end)
      |> Enum.map_reduce([], fn {z, o}, acc ->
        most = if o >= z, do: "1", else: "0"
        least = if o < z, do: "1", else: "0"
        {{most, least}, acc}
      end)
      |> elem(0)
      |> Enum.unzip()

    String.to_integer(Enum.join(most_list), 2) * String.to_integer(Enum.join(least_list), 2)
  end

  defp parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line ->
      line
      |> String.graphemes()
    end)
  end
end

part1Answer = Day3.part1(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 4_138_664

part2Answer = Day3.part2(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 4_273_224
