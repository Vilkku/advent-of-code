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
      |> Enum.map(fn row ->
        row
        |> Day10.replace_until_stable(["()", "[]", "{}", "<>"], "")
      end)
      |> Enum.filter(fn row ->
        row
        |> String.contains?([")", "]", "}", ">"])
      end)
      |> Enum.map(fn row ->
        row
        |> String.graphemes()
        |> Enum.filter(fn char -> char == ")" || char == "]" || char == "}" || char == ">" end)
        |> hd()
      end)
      |> Enum.map(fn char ->
        case char do
          ")" -> 3
          "]" -> 57
          "}" -> 1197
          ">" -> 25137
        end
      end)
      |> Enum.sum()
    end
  end
end

part1Answer = Day10.Part1.solve(input)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 168_417
