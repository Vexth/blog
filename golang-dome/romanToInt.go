package main

func romanToInt(s string) int {
	m := map[rune]int{
		'I': 1,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	}

	sum, curr, next, i := 0, 0, 0, 0
	for i < len(s) {
		if i == len(s)-1 {
			sum += m[rune(s[i])]
			break
		}
		curr = m[rune(s[i])]
		next = m[rune(s[i+1])]

		if curr < next {
			sum += next - curr
			i += 2
		} else {
			sum += curr
			i++
		}
	}

	return sum
}
