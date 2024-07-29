package core

import "fmt"

func OutputFormat() {
	// Calculate max columns.
	maxCols := 0
	for _, xlsmfile := range XlsmFiles {
		for _, row := range xlsmfile.Content {
			if len(row) > maxCols {
				maxCols = len(row)
			}
		}
	}
	cellIdx := 0
	for cellIdx < maxCols {
		cellMaxWidth := 0
		// Find cell max width.
		for _, xlsmFile := range XlsmFiles {
			for _, row := range xlsmFile.Content {
				if cellIdx < len(row) {
					if len(row[cellIdx]) > cellMaxWidth {
						cellMaxWidth = len(row[cellIdx])
					}
				}
			}
		}

		// Format the cell.
		format := fmt.Sprintf("%%-%ds", cellMaxWidth)
		for _, xlsmFile := range XlsmFiles {
			for i, row := range xlsmFile.Content {
				if cellIdx < len(row) {
					cellContent := row[cellIdx]
					if len(cellContent) < cellMaxWidth {
						xlsmFile.Content[i][cellIdx] = fmt.Sprintf(format, cellContent)
					}
				}
			}
		}
		cellIdx++
	}
	for _, xlsmFile := range XlsmFiles {
		for _, row := range xlsmFile.Content {
			fmt.Println(row)
		}
	}
}
