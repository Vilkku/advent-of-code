package main

import (
	"advent-of-code/2024/util"
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
	lineNumber := 0
	var guardPosition [2]int

	for scanner.Scan() {
		row := strings.Split(scanner.Text(), "")
		rows = append(rows, row)

		guardPositionIndex := util.IndexOf(row, "^")

		if guardPositionIndex != -1 {
			guardPosition = [2]int{lineNumber, guardPositionIndex}
		}

		lineNumber++
	}

	visited := 0
	dirX := 0
	dirY := -1

	for {
		fmt.Printf("Start: %v, ", guardPosition)

		if rows[guardPosition[0]][guardPosition[1]] != "X" {
			rows[guardPosition[0]][guardPosition[1]] = "X"
			visited++

			fmt.Printf("first time visiting\n")
		} else {
			fmt.Printf("has visited before\n")
		}

		nextPosition := [2]int{guardPosition[0] + 1*dirY, guardPosition[1] + 1*dirX}

		fmt.Printf("Next position is %v", nextPosition)

		if nextPosition[0] < 0 ||
			nextPosition[0] >= len(rows) ||
			nextPosition[1] < 0 ||
			nextPosition[1] >= len(rows[0]) {
			fmt.Printf(", reached the end\n\n")
			break
		}

		if rows[nextPosition[0]][nextPosition[1]] == "#" {
			if dirY == -1 {
				dirX = 1
				dirY = 0
			} else if dirY == 1 {
				dirX = -1
				dirY = 0
			} else if dirX == -1 {
				dirX = 0
				dirY = -1
			} else if dirX == 1 {
				dirX = 0
				dirY = 1
			}

			fmt.Printf(", contains a rock\n")

			nextPosition = [2]int{guardPosition[0] + 1*dirY, guardPosition[1] + 1*dirX}
		}

		fmt.Printf("Going to %v\n\n", nextPosition)

		guardPosition = nextPosition
	}

	fmt.Printf("Part 1: %v\n", visited)
}
