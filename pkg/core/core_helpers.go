/*
* Package: core
* File: core_helpers.go
*
* Description:
* This file contains helper functions for processing components and handling
* Excel file operations. It includes functionality for validating file extensions,
* checking for keywords, fixing row lengths, and grouping components by their
* Manufacturer Part Number (MPN).
*
* Main Functions:
* - HasValidExtension: Checks if a filename has a valid extension.
* - ContainsKeywords: Determines if a string matches any defined keywords.
* - blankTailsFix: Ensures all rows in the content have the same number of columns.
* - fixLn: Removes newline characters from each cell in the provided rows.
* - groupByMpn: Groups components by MPN and sums their quantities to avoid duplicates.
 */

package core

import (
	"config"
	"path/filepath"
	"strings"
)

// HasValidExtension checks if the given filename has a valid extension.
func HasValidExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, validExt := range config.FILE_EXT {
		if ext == validExt {
			return true
		}
	}
	return false
}

// ContainsKeywords checks if the normalized input string matches any keywords defined in config.
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

// blankTailsFix ensures that all rows in the file.Content have the same number of columns.
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

// fixLn removes newline characters from each cell in the provided rows.
func fixLn(rows [][]string) [][]string {
	for i := range rows {
		for j := range rows[i] {
			rows[i][j] = strings.ReplaceAll(rows[i][j], "\n", "")
		}
	}
	return rows
}

// groupByMpn groups components by their MPN and sums their quantities.
func groupByMpn(components []Component) []Component {
	grouped := make(map[string]Component)
	var withoutMpn []Component
	for _, component := range components {
		if component.Mpn == "" {
			withoutMpn = append(withoutMpn, component)
			continue
		} else if existing, found := grouped[component.Mpn]; found {
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
	result = append(result, withoutMpn...)
	return result
}
