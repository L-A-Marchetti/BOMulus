package components

import (
	"core"
	"strings"
)

// Detect automatically the header row.
func HeaderDetection() {
	header := 0
	for i, row := range core.XlsmFiles[1].Content {
		for j, col := range row {
			if core.ContainsKeywords(col) {
				switch strings.ToLower(strings.ReplaceAll(col, " ", "")) {
				case "quantity":
					core.Filters.Quantity = j
				case "manufacturerpartnumber":
					core.Filters.Mpn = j
				case "description":
					core.Filters.Description = j
				}
				header = i
			}
		}
	}
	core.Filters.Header = header + 1
}
