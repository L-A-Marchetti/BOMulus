package components

import "core"

// Detect automatically the header row.
func HeaderDetection() {
	header := 0
	for i, row := range core.XlsmFiles[1].Content {
		for _, col := range row {
			if core.ContainsKeywords(col) {
				header = i
			}
		}
	}
	core.Filters.Header = header + 1
}
