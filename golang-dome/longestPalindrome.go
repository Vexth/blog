package main

func longestPalindrome(s string) string {
	l := len(s)
	if l < 2 {
		return s
	}

	start, end := 0, 0
	for i := 0; i < l; {
		left, right := i, i
		for right < l-1 && s[right] == s[right+1] {
			right++
		}
		i = right + 1
		for left > 0 && right < l-1 && s[left-1] == s[right+1] {
			left--
			right++
		}
		if end < right-left {
			start = left
			end = right - left
		}
	}
	return s[start : start+end+1]
}
