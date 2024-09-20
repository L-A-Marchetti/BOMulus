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
	for i, row := range core.XlsmFiles[0].Content {
		for j, col := range row {
			if core.ContainsKeywords(col) {
				switch strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(col, " ", ""), "_", "")) {
				case "quantity":
					core.Filters[0].Quantity = j
				case "manufacturerpartnumber", "mpn":
					core.Filters[0].Mpn = j
				case "description":
					core.Filters[0].Description = j
				case "designator":
					core.Filters[0].Designator = j
				case "manufacturer", "manufacturername":
					core.Filters[0].Manufacturer = j
				}
				header = i
			}
		}
	}
	core.Filters[0].Header = header + 1
	header = 0
	for i, row := range core.XlsmFiles[1].Content {
		for j, col := range row {
			if core.ContainsKeywords(col) {
				switch strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(col, " ", ""), "_", "")) {
				case "quantity":
					core.Filters[1].Quantity = j
				case "manufacturerpartnumber", "mpn":
					core.Filters[1].Mpn = j
				case "description":
					core.Filters[1].Description = j
				case "designator":
					core.Filters[1].Designator = j
				case "manufacturer", "manufacturername":
					core.Filters[1].Manufacturer = j
				}
				header = i
			}
		}
	}
	core.Filters[1].Header = header + 1
}
