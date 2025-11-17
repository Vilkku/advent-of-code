import ExUnit.Assertions

input = File.read!("input.txt")
example_input = "[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]"

defmodule Day10 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split("\n", trim: true)
  end

  def replace_until_stable(string, pattern, replacement) do
    new_string = String.replace(string, pattern, replacement)

    if new_string == string do
      string
    else
      replace_until_stable(new_string, pattern, replacement)
    end
  end

  defmodule Part1 do
    def solve(input) do
      Day10.parse_input(input)
      |> Enum.map(&Day10.replace_until_stable(&1, ["()", "[]", "{}", "<>"], ""))
      |> Enum.filter(&String.contains?(&1, [")", "]", "}", ">"]))
      |> Enum.map(fn row ->
        row
        |> String.graphemes()
        |> Enum.find(&(&1 in [")", "]", "}", ">"]))
      end)
      |> Enum.map(fn char ->
        scores = %{")" => 3, "]" => 57, "}" => 1197, ">" => 25137}
        Map.get(scores, char)
      end)
      |> Enum.sum()
    end
  end

  defmodule Part2 do
    def solve(input) do
      Day10.parse_input(input)
      |> Enum.map(&Day10.replace_until_stable(&1, ["()", "[]", "{}", "<>"], ""))
      |> Enum.filter(&(!String.contains?(&1, [")", "]", "}", ">"])))
      |> Enum.map(&String.reverse/1)
      |> Enum.map(fn original_string ->
        replacements = %{"(" => ")", "[" => "]", "{" => "}", "<" => ">"}

        Enum.reduce(replacements, original_string, fn {from, to}, acc ->
          String.replace(acc, from, to)
        end)
      end)
      |> Enum.map(fn completion_string ->
        scores = %{")" => 1, "]" => 2, "}" => 3, ">" => 4}

        Enum.reduce(String.graphemes(completion_string), 0, fn char, acc ->
          acc * 5 + Map.get(scores, char)
        end)
      end)
      |> Enum.sort()
      |> then(&Enum.at(&1, div(length(&1), 2)))
    end
  end
end

part1Answer = Day10.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 168_417

part2Answer = Day10.Part2.solve(input)
IO.puts("Part 2: #{part2Answer}")
assert part2Answer == 2_802_519_786
