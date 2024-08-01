package core

import (
	"fmt"
)

// Determine the maximum number of columns.
func MaxCol() int {
	maxColumns := 0
	for _, file := range XlsmFiles {
		for _, row := range file.Content {
			if len(row) > maxColumns {
				maxColumns = len(row)
			}
		}
	}
	return maxColumns
}

// Helper function to generate generic column titles.
func GetColumnTitles(count int) []string {
	titles := make([]string, count)
	for i := 0; i < count; i++ {
		titles[i] = fmt.Sprintf("Column %d", i+1)
	}
	return titles
}

func MakeRange(min, max int) []int {
	a := make([]int, max-min)
	for i := range a {
		a[i] = min + i
	}
	return a
}

// Function to now if []int contains i.
func ContainsInteger(slice []int, i int) bool {
	for _, v := range slice {
		if v == i {
			return true
		}
	}
	return false
}
