package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
)

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	re := regexp.MustCompile("[0-9]+")
	safeReports := 0
	safeReportsWithOneBadNumberAllowed := 0

	for scanner.Scan() {
		numbersAsStr := re.FindAllString(scanner.Text(), -1)
		var numbers []int

		for _, numberAsStr := range numbersAsStr {
			num, err := strconv.Atoi(numberAsStr)

			if err != nil {
				log.Fatal(err)
			}

			numbers = append(numbers, num)
		}

		if isReportValid(numbers) {
			safeReports = safeReports + 1
			safeReportsWithOneBadNumberAllowed = safeReportsWithOneBadNumberAllowed + 1
		} else if isReportValidWithOneBadNumberAllowed(numbers) {
			safeReportsWithOneBadNumberAllowed = safeReportsWithOneBadNumberAllowed + 1
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Part 1: %d\n", safeReports)
	fmt.Printf("Part 2: %d\n", safeReportsWithOneBadNumberAllowed)
}

func isReportValid(numbers []int) bool {
	isIncreasing := numbers[1]-numbers[0] > 0

	for i := range numbers {
		if i == 0 {
			continue
		}

		if !isValidInSafeReport(numbers[i-1], numbers[i], isIncreasing) {
			return false
		}

		if i == len(numbers)-1 {
			return true
		}
	}

	return false
}

func isReportValidWithOneBadNumberAllowed(numbers []int) bool {
	for i := range numbers {
		numbersWithoutOne := RemoveIndex(numbers, i)

		if isReportValid(numbersWithoutOne) {
			return true
		}
	}

	return false
}

func isValidInSafeReport(prev int, curr int, isIncreasing bool) bool {
	if isIncreasing {
		return curr-prev >= 1 && curr-prev <= 3
	} else {
		return prev-curr >= 1 && prev-curr <= 3
	}
}

func RemoveIndex(s []int, index int) []int {
	ret := make([]int, 0)
	ret = append(ret, s[:index]...)
	return append(ret, s[index+1:]...)
}
