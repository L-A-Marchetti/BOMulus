package components

import (
	"config"
	"core"
	"strconv"
	"strings"
)

func ComponentsDetection(file *core.XlsmFile) {
	if config.DEBUGGING {
		defer core.StartBenchmark("ComponentsDetection()", false).Stop()
	}
	for i, row := range file.Content {
		if i >= file.Filters.Header {
			quantity, err := strconv.Atoi(row[file.Filters.Quantity])
			if err != nil {
				continue
			}
			component := core.Component{
				Quantity:         quantity,
				Mpn:              strings.TrimSpace(row[file.Filters.Mpn]),
				UserDescription:  row[file.Filters.Description],
				Designator:       row[file.Filters.Designator],
				UserManufacturer: row[file.Filters.Manufacturer],
			}
			file.Components = append(file.Components, component)
		}
	}
}
