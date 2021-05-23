// 给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。

// 示例 1:

// 输入: "Let's take LeetCode contest"
// 输出: "s'teL ekat edoCteeL tsetnoc"
// 注意：在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。

package main

import (
	"bytes"
	"fmt"
	"strings"
)

func reverseWords(s string) string {
	str := strings.Split(s, " ")
	for i := 0; i < len(str); i++ {
		str[i] = reverseString(str[i])
	}
	return strings.Replace(strings.Trim(fmt.Sprint(str), "[]"), " ", " ", -1)
}

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
