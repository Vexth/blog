// 编写一个函数，其作用是将输入的字符串反转过来。

// 示例 1:

// 输入: "hello"
// 输出: "olleh"
// 示例 2:

// 输入: "A man, a plan, a canal: Panama"
// 输出: "amanaP :lanac a ,nalp a ,nam A"

package main

import "bytes"

func reverseString(s string) string {
	if len(s) == 0 {
		return s
	}

	as := new(bytes.Buffer)
	for i := len(s) - 1; i >= 0; i-- {
		as.WriteByte(s[i])
	}
	return as.String()
}
