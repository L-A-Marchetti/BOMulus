package components

import (
	"config"
	"core"
	"strings"
)

// Detect automatically the header row.
func HeaderDetection() {
	if config.DEBUGGING {
		defer core.StartBenchmark("HeaderDetection()", false).Stop()
	}
	core.ResetFilters()
	header := 0
	for i, row := range core.XlsmFiles[1].Content {
		for j, col := range row {
			if core.ContainsKeywords(col) {
				switch strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(col, " ", ""), "_", "")) {
				case "quantity":
					core.Filters.Quantity = j
				case "manufacturerpartnumber", "mpn":
					core.Filters.Mpn = j
				case "description":
					core.Filters.Description = j
				case "designator":
					core.Filters.Designator = j
				case "manufacturer", "manufacturername":
					core.Filters.Manufacturer = j
				}
				header = i
			}
		}
	}
	core.Filters.Header = header + 1
}
