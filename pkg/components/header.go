package components

import (
	"config"
	"core"
	"strings"
)

// Detect automatically the header row.
func HeaderDetection(file *core.XlsmFile) {
	if config.DEBUGGING {
		defer core.StartBenchmark("HeaderDetection()", false).Stop()
	}
	header := 0
	for i, row := range file.Content {
		for j, col := range row {
			if core.ContainsKeywords(col) {
				switch strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(col, " ", ""), "_", "")) {
				case "quantity":
					file.Filters.Quantity = j
				case "manufacturerpartnumber", "mpn":
					file.Filters.Mpn = j
				case "description":
					file.Filters.Description = j
				case "designator":
					file.Filters.Designator = j
				case "manufacturer", "manufacturername":
					file.Filters.Manufacturer = j
				}
				header = i
			}
		}
	}
	file.Filters.Header = header + 1
}
