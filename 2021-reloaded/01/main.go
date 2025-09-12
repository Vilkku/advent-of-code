package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func main() {
	file, err := os.Open("01/input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	var prev int
	var increases int

	for scanner.Scan() {
		curr, errCurr := strconv.Atoi(scanner.Text())

		if errCurr != nil {
			log.Fatal(errCurr)
		}

		if prev == 0 {
			prev = curr
		}

		if curr > prev {
			increases++
		}

		prev = curr
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Part 1: %d\n", increases)
}
