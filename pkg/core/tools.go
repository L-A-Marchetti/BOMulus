package core

import (
	"config"
	"fmt"
	"io"
	"os"
	"strings"
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
		if XlsmDeltas[0].NewRow-1 < 0 {
			titles[i] = fmt.Sprintf("Column %d", i+1)
		} else if i < len(XlsmFiles[1].Content[XlsmDeltas[0].NewRow-1]) {
			titles[i] = XlsmFiles[1].Content[XlsmDeltas[0].NewRow-1][i]
		}
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

// Function to now if keywords contains s.
// Maybe add a tolower filter...
func ContainsKeywords(s string) bool {
	normalizedInput := strings.ToLower(strings.ReplaceAll(s, " ", ""))
	for _, keyword := range config.HEADER_KEYWORDS {
		normalizedKeyword := strings.ToLower(strings.ReplaceAll(keyword, " ", ""))
		if normalizedKeyword == normalizedInput {
			return true
		}
	}
	return false
}

// Function to duplicate a file.
func CopyFile(src, dst string) error {
	if config.DEBUGGING {
		defer StartBenchmark("CopyFile()", false).Stop()
	}
	sourceFile, err := os.Open(src)
	ErrorsHandler(err)
	defer sourceFile.Close()
	destinationFile, err := os.Create(dst)
	ErrorsHandler(err)
	defer destinationFile.Close()
	_, err = io.Copy(destinationFile, sourceFile)
	ErrorsHandler(err)
	return destinationFile.Sync()
}

// Fix the blank tails skipped by the GetRows function.
func blankTailsFix() {
	if config.DEBUGGING {
		defer StartBenchmark("blankTailsFix()", false).Stop()
	}
	maxCol := 0
	for _, row := range XlsmFiles[0].Content {
		if len(row) > maxCol {
			maxCol = len(row)
		}
	}
	for _, row := range XlsmFiles[1].Content {
		if len(row) > maxCol {
			maxCol = len(row)
		}
	}
	for i := range XlsmFiles[0].Content {
		for len(XlsmFiles[0].Content[i]) < maxCol {
			XlsmFiles[0].Content[i] = append(XlsmFiles[0].Content[i], "")
		}
	}
	for i := range XlsmFiles[1].Content {
		for len(XlsmFiles[1].Content[i]) < maxCol {
			XlsmFiles[1].Content[i] = append(XlsmFiles[1].Content[i], "")
		}
	}
}
