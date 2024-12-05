package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var rows [][]string

	for scanner.Scan() {
		rows = append(rows, strings.Split(scanner.Text(), ""))
	}

	offsetModifierPairs := [8][2]int{{1, 0}, {1, -1}, {0, -1}, {-1, -1}, {-1, 0}, {-1, 1}, {0, 1}, {1, 1}}
	xmasCount := 0

	for y, row := range rows {
		for x, char := range row {
			if char == "X" {
				for _, offsetModifiers := range offsetModifierPairs {
					if letterMatches("M", rows, x, y, 1, offsetModifiers) && letterMatches("A", rows, x, y, 2, offsetModifiers) && letterMatches("S", rows, x, y, 3, offsetModifiers) {
						xmasCount++
					}
				}
			}
		}
	}

	fmt.Printf("Part 1: %d\n", xmasCount)

	masOffsetModifierPairs := [4][2]int{{1, 1}, {-1, -1}}
	masCount := 0

	visualOutput := make([][]string, len(rows))
	for i := range visualOutput {
		visualOutput[i] = make([]string, len(rows[i]))

		for j := range visualOutput[i] {
			visualOutput[i][j] = "."
		}
	}

	for y, row := range rows {
		for x, char := range row {
			if char == "A" {
				for _, offsetModifiers := range masOffsetModifierPairs {
					if letterMatches("M", rows, x, y, 1, [2]int{offsetModifiers[0], offsetModifiers[1]}) &&
						letterMatches("S", rows, x, y, 1, [2]int{offsetModifiers[0] * -1, offsetModifiers[1] * -1}) &&
						((letterMatches("M", rows, x, y, 1, [2]int{offsetModifiers[0] * -1, offsetModifiers[1]}) &&
							letterMatches("S", rows, x, y, 1, [2]int{offsetModifiers[0], offsetModifiers[1] * -1})) ||
							(letterMatches("M", rows, x, y, 1, [2]int{offsetModifiers[0], offsetModifiers[1] * -1}) &&
								letterMatches("S", rows, x, y, 1, [2]int{offsetModifiers[0] * -1, offsetModifiers[1]}))) {
						masCount++

						visualOutput[y][x] = "A"

						visualOutput[y+offsetModifiers[1]][x+offsetModifiers[0]] = "M"
						visualOutput[y+offsetModifiers[1]*-1][x+offsetModifiers[0]*-1] = "S"

						visualOutput[y+offsetModifiers[1]][x+offsetModifiers[0]*-1] = "M"
						visualOutput[y+offsetModifiers[1]*-1][x+offsetModifiers[0]] = "S"
					}
				}
			}
		}
	}

	fmt.Printf("Part 2: %d\n", masCount)

	for i := range visualOutput {
		for j := range visualOutput[i] {
			fmt.Print(visualOutput[i][j])
		}

		fmt.Print("\n")
	}
}

func letterMatches(letter string, rows [][]string, x int, y int, offset int, offsetModifiers [2]int) bool {
	xOffset := x + (offset * offsetModifiers[0])
	yOffset := y + (offset * offsetModifiers[1])

	return yOffset >= 0 && yOffset < len(rows) && xOffset >= 0 && xOffset < len(rows[yOffset]) && rows[yOffset][xOffset] == letter
}
