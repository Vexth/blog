package main

func longestCommonPrefix(strs []string) string {
	if len(strs) == 0 {
		return ""
	}

	prefix := strs[0]

	for i := 1; i < len(strs); i++ {
		j := 0
		for j = 0; j < len(prefix) && j < len(strs[i]); j++ {

			if prefix[j] != strs[i][j] {
				break
			}

		}
		prefix = prefix[0:j]
		if prefix == "" {
			return prefix
		}
	}

	return prefix

}
