package util

import "log"

func RemoveIndex[T comparable](s []T, index int) []T {
	ret := make([]T, 0)
	ret = append(ret, s[:index]...)
	return append(ret, s[index+1:]...)
}

func IndexOf[T comparable](haystack []T, needle T) int {
	for i, v := range haystack {
		if v == needle {
			return i
		}
	}

	return -1
}

func MoveElement[T comparable](slice []T, from, to int) []T {
	if from < 0 || from >= len(slice) || to < 0 || to >= len(slice) {
		log.Fatal("Out of range error")
	}

	element := slice[from]
	if from < to {
		copy(slice[from:], slice[from+1:to+1])
	} else {
		copy(slice[to+1:], slice[to:from])
	}

	slice[to] = element

	return slice
}
