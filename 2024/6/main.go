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

		if (guardPositionIndex != -1) {
			guardPosition = [2]int{lineNumber, guardPositionIndex}
		}

		lineNumber++
	}

	fmt.Printf("Part 1: %v\n", guardPosition)
}
