import ExUnit.Assertions

input = File.read!("input.txt")

defmodule Day8 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split("\n", trim: true)
    |> Enum.map(fn row ->
      [signals, outputs] = String.split(row, "|", parts: 2, trim: true)

      {String.split(signals, " ", trim: true), String.split(outputs, " ", trim: true)}
    end)
  end

  defmodule Part1 do
    def solve(input) do
      Day8.parse_input(input)
      |> Enum.flat_map(fn {_, output_values} ->
        output_values
      end)
      |> Enum.count(fn str ->
        # digits 1, 7, 4, 8
        String.length(str) in [2, 3, 4, 7]
      end)
    end
  end

  defmodule Part2 do
    def solve(input) do
      Day8.parse_input(input)
      |> Enum.map(fn {inputValue, outputValue} ->
        patterns =
          inputValue
          |> Enum.map(&MapSet.new(String.graphemes(&1)))

        {[one], rest} = Enum.split_with(patterns, fn p -> MapSet.size(p) == 2 end)
        {[four], rest} = Enum.split_with(rest, fn p -> MapSet.size(p) == 4 end)
        {[seven], rest} = Enum.split_with(rest, fn p -> MapSet.size(p) == 3 end)
        {[eight], rest} = Enum.split_with(rest, fn p -> MapSet.size(p) == 7 end)

        {[six], rest} =
          Enum.split_with(rest, fn p ->
            MapSet.size(p) == 6 and shared_letter_count(p, one) == 1
          end)

        {[five], rest} =
          Enum.split_with(rest, fn p ->
            MapSet.size(p) == 5 and shared_letter_count(p, six) == 5
          end)

        {[nine], rest} =
          Enum.split_with(rest, fn p ->
            MapSet.size(p) == 6 and shared_letter_count(p, five) == 5
          end)

        {[three], rest} =
          Enum.split_with(rest, fn p ->
            MapSet.size(p) == 5 and shared_letter_count(p, nine) == 5
          end)

        {[zero], rest} = Enum.split_with(rest, fn p -> MapSet.size(p) == 6 end)
        {[two], _rest} = Enum.split_with(rest, fn p -> MapSet.size(p) == 5 end)

        output_sets = Enum.map(outputValue, &MapSet.new(String.graphemes(&1)))

        digits =
          Enum.map(output_sets, fn item ->
            case item do
              ^zero -> 0
              ^one -> 1
              ^two -> 2
              ^three -> 3
              ^four -> 4
              ^five -> 5
              ^six -> 6
              ^seven -> 7
              ^eight -> 8
              ^nine -> 9
            end
          end)

        digits
        |> Enum.join()
        |> String.to_integer()
      end)
      |> Enum.sum()
    end

    defp shared_letter_count(a, b),
      do:
        MapSet.size(
          MapSet.intersection(
            a,
            b
          )
        )
  end
end

part1Answer = Day8.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 274

part2Answer = Day8.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 1_012_089
