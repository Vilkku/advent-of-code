package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
)

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	re := regexp.MustCompile("(?P<low>[0-9]+)[[:space:]]+(?P<high>[0-9]+)")
	var lefts []int
	var rights []int

	for scanner.Scan() {
		split := re.FindStringSubmatch(scanner.Text())

		left, errLeft := strconv.Atoi(split[1])

		if errLeft != nil {
			log.Fatal(err)
		}

		right, errRight := strconv.Atoi(split[2])

		if errRight != nil {
			log.Fatal(err)
		}

		lefts = append(lefts, left)
		rights = append(rights, right)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	sort.Slice(lefts, func(i, j int) bool {
		return lefts[i] < lefts[j]
	})

	sort.Slice(rights, func(i, j int) bool {
		return rights[i] < rights[j]
	})

	diff := 0

	for i := range lefts {
		if lefts[i] > rights[i] {
			diff = diff + lefts[i] - rights[i]
		} else {
			diff = diff + rights[i] - lefts[i]
		}
	}

	fmt.Printf("Part 1: %d\n", diff)

	frequency := make(map[int]int)
	for _, value := range rights {
		frequency[value]++
	}

	similarity := 0

	for _, value := range lefts {
		similarity = similarity + value*frequency[value]
	}

	fmt.Printf("Part 2: %d\n", similarity)
}
