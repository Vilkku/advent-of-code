package main

import (
	"fmt"
	"log"
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

	memory := string(file)

	re := regexp.MustCompile(`mul\((?P<a>\d{1,3}),(?P<b>\d{1,3})\)`)
	matches := re.FindAllStringSubmatch(memory, -1)
	sum := 0

	for _, match := range matches {
		a, err := strconv.Atoi(match[1])

		if err != nil {
			log.Fatal(err)
		}

		b, err := strconv.Atoi(match[2])

		if err != nil {
			log.Fatal(err)
		}

		sum += a * b
	}

	fmt.Printf("Part 1: %d\n", sum)

	reWithStatus := regexp.MustCompile(`mul\((?P<a>\d{1,3}),(?P<b>\d{1,3})\)|do\(\)|don't\(\)`)
	matchesWithStatus := reWithStatus.FindAllStringSubmatch(memory, -1)
	sumWithStatus := 0
	enabled := true

	for _, match := range matchesWithStatus {
		if strings.HasPrefix(match[0], "don't(") {
			enabled = false
			continue
		}

		if strings.HasPrefix(match[0], "do(") {
			enabled = true
			continue
		}

		if enabled && strings.HasPrefix(match[0], "mul(") {
			a, err := strconv.Atoi(match[1])

			if err != nil {
				log.Fatal(err)
			}

			b, err := strconv.Atoi(match[2])

			if err != nil {
				log.Fatal(err)
			}

			sumWithStatus += a * b
		}
	}

	fmt.Printf("Part 2: %d\n", sumWithStatus)
}
