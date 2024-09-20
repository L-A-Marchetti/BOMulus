package core

import (
	"config"
	"io"
	"os"
	"strings"
)

// Function to now if keywords contains s.
func ContainsKeywords(s string) bool {
	normalizedInput := strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(s, " ", ""), "_", ""))
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
