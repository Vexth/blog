package main

import "math"

func rank(arr []int, key int) int {
	lf, lr := 0, len(arr)-1
	for lf <= lr {
		// m := lf + (lr - lf) / 2
		// m := (lf + lr) >> 1
		m := int(math.Floor(float64((lf + lr) / 2)))
		mv := arr[m]
		if mv == key {
			return m
		} else if mv > key {
			lr = m - 1
		} else if mv < key {
			lf = m + 1
		}
	}

	return -1
}
