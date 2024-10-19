package core

import (
	"config"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// Helper function to check if the file has a valid extension
func HasValidExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, validExt := range config.FILE_EXT {
		if ext == validExt {
			return true
		}
	}
	return false
}

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
func blankTailsFix(file *XlsmFile) {
	if config.DEBUGGING {
		defer StartBenchmark("blankTailsFix()", false).Stop()
	}
	maxCol := 0
	for _, row := range file.Content {
		if len(row) > maxCol {
			maxCol = len(row)
		}
	}
	for i := range file.Content {
		for len(file.Content[i]) < maxCol {
			file.Content[i] = append(file.Content[i], "")
		}
	}
}

// New line filter helper for XlsmReader()
func fixLn(rows [][]string) [][]string {
	for i := range rows {
		for j := range rows[i] {
			rows[i][j] = strings.ReplaceAll(rows[i][j], "\n", "")
		}
	}
	return rows
}

/*
// Avoid duplicates by grouping components using their mpn and summing their quantities.
func groupByMpn(components []Component) []Component {
	grouped := make(map[string]Component)
	for _, component := range components {
		if existing, found := grouped[component.Mpn]; found {
			existing.Quantity += component.Quantity
			grouped[component.Mpn] = existing
		} else {
			grouped[component.Mpn] = component
		}
	}
	var result []Component
	for _, component := range grouped {
		result = append(result, component)
	}

	return result
}
*/
