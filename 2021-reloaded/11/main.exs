import ExUnit.Assertions

input = File.read!("input.txt")
example_input = "5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526"

defmodule Day11 do
  def parse_input(input) do
    input
    |> String.trim()
    |> String.split("\n", trim: true)
    |> Enum.map(fn str ->
      str
      |> String.graphemes()
      |> Enum.map(&String.to_integer/1)
    end)
  end

  def to_map(values) do
    rows = length(values)
    cols = values |> hd() |> length()

    map =
      values
      |> Enum.with_index()
      |> Enum.flat_map(fn {row, r} ->
        Enum.with_index(row, fn v, c -> {{r, c}, v} end)
      end)
      |> Enum.into(%{})

    {map, rows, cols}
  end

  def neighbors({r, c}, rows, cols) do
    for dr <- -1..1, dc <- -1..1, not (dr == 0 and dc == 0), into: [] do
      {r + dr, c + dc}
    end
    |> Enum.filter(fn {nr, nc} ->
      nr >= 0 and nc >= 0 and nr < rows and nc < cols
    end)
  end

  defmodule Part1 do
    def solve(input, n) do
      values = Day11.parse_input(input)
      {map, rows, cols} = Day11.to_map(values)

      Enum.reduce(1..n, {map, 0}, fn _step, {m, total_flashes} ->
        {m_after_step, flashes} = step(m, rows, cols)
        {m_after_step, total_flashes + flashes}
      end)
      |> then(fn {_m, total} -> total end)
    end

    def step(map, rows, cols) do
      map = Enum.into(map, %{}, fn {k, v} -> {k, v + 1} end)

      {final_map, flashed} = process_flashes(map, MapSet.new(), rows, cols)

      final_map =
        Enum.reduce(flashed, final_map, fn pos, acc ->
          Map.put(acc, pos, 0)
        end)

      {final_map, MapSet.size(flashed)}
    end

    defp process_flashes(map, flashed, rows, cols) do
      to_flash =
        map
        |> Enum.filter(fn {pos, energy} -> energy > 9 and not MapSet.member?(flashed, pos) end)
        |> Enum.map(fn {pos, _} -> pos end)

      case to_flash do
        [] ->
          {map, flashed}

        _ ->
          {map, flashed} =
            Enum.reduce(to_flash, {map, flashed}, fn pos, {m_acc, f_acc} ->
              f_acc = MapSet.put(f_acc, pos)

              Day11.neighbors(pos, rows, cols)
              |> Enum.reduce(m_acc, fn neighbor, acc ->
                Map.update(acc, neighbor, 1, &(&1 + 1))
              end)
              |> then(fn new_map -> {new_map, f_acc} end)
            end)

          process_flashes(map, flashed, rows, cols)
      end
    end
  end
end

part1Answer = Day11.Part1.solve(input, 100)
IO.puts("Part 1: #{part1Answer}")
assert part1Answer == 1679
