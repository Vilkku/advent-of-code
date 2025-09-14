<?php
declare(strict_types=1);

$inputRows = explode(PHP_EOL, file_get_contents('input.txt'));

function part1(array $inputRows): int
{
    $increases = 0;

    foreach ($inputRows as $row => $curr) {
        if ($row > 0 && $curr > $inputRows[$row - 1]) {
            $increases++;
        }
    }

    return $increases;
}

function part2(array $inputRows): int
{
    $prev = 0;
    $increases = 0;

    foreach ($inputRows as $row => $currentRow) {
        if ($row > 2) {
            $curr = (int)$currentRow +
                (int)$inputRows[$row - 1] +
                (int)$inputRows[$row - 2];

            if ($curr > $prev) {
                $increases++;
            }

            $prev = $curr;
        }
    }

    return $increases;
}

$part1Answer = part1($inputRows);
echo "Part 1: {$part1Answer}", PHP_EOL;
assert($part1Answer === 1400);

$part2Answer = part2($inputRows);
echo "Part 2: {$part2Answer}", PHP_EOL;
assert($part2Answer === 1429);
