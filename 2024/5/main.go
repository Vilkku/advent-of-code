package main

import (
	"advent-of-code/2024/util"
	"fmt"
	"log"
	"math"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func main() {
	file, err := os.ReadFile("input.txt")
	if err != nil {
		log.Fatal(err)
	}

	input := string(file)

	parts := regexp.
		MustCompile(`\n\s*\n`).
		Split(input, -1)

	var rules [][2]int

	for _, row := range strings.Split(parts[0], "\n") {
		rowParts := strings.Split(row, "|")

		firstInt, err := strconv.Atoi(rowParts[0])
		if err != nil {
			log.Fatal(err)
		}

		secondInt, err := strconv.Atoi(rowParts[1])
		if err != nil {
			log.Fatal(err)
		}

		rules = append(rules, [2]int{firstInt, secondInt})
	}

	var updates [][]int

	for _, row := range strings.Split(parts[1], "\n") {
		if len(row) == 0 {
			continue
		}

		rowParts := strings.Split(row, ",")
		rowInts := []int{}
		for _, s := range rowParts {
			pageNum, err := strconv.Atoi(s)
			if err != nil {
				log.Fatal(err)
			}

			rowInts = append(rowInts, pageNum)
		}

		updates = append(updates, rowInts)
	}

	middlePagesSum := 0
	var incorrectUpdates [][]int

part1Outer:
	for _, update := range updates {
		for _, rule := range rules {
			firstPageIndex := util.IndexOf(update, rule[0])
			secondPageIndex := util.IndexOf(update, rule[1])

			if firstPageIndex == -1 || secondPageIndex == -1 {
				continue
			}

			if secondPageIndex < firstPageIndex {
				incorrectUpdates = append(incorrectUpdates, update)
				continue part1Outer
			}
		}

		middlePageIndex := int64(math.Floor(float64(len(update)) / 2))

		middlePagesSum += update[middlePageIndex]
	}

	fmt.Printf("Part 1: %d\n", middlePagesSum)

	fixedUpdatesMiddlePagesSum := 0

	for _, update := range incorrectUpdates {
		fmt.Printf("\nProcessing %v\n", update)

		fixedUpdate := make([]int, len(update))
		copy(fixedUpdate, update)

	part2Outer:
		for {
			fmt.Printf("\nRestarting, current %v\n", fixedUpdate)

			for _, rule := range rules {
				firstPageIndex := util.IndexOf(fixedUpdate, rule[0])
				secondPageIndex := util.IndexOf(fixedUpdate, rule[1])

				if firstPageIndex == -1 || secondPageIndex == -1 {
					continue
				}

				if secondPageIndex < firstPageIndex {
					fixedUpdate = util.MoveElement(fixedUpdate, firstPageIndex, secondPageIndex)

					fmt.Printf("Moving %d before %d, result %v\n", rule[1], rule[0], fixedUpdate)

					continue part2Outer
				}
			}

			break
		}

		fmt.Printf("%v is fixed: %v\n", update, fixedUpdate)

		middlePageIndex := int64(math.Floor(float64(len(fixedUpdate)) / 2))

		fixedUpdatesMiddlePagesSum += fixedUpdate[middlePageIndex]
	}

	fmt.Printf("Part 1: %d\n", fixedUpdatesMiddlePagesSum)
}
