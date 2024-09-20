package components

import (
	"config"
	"core"
	"fmt"
	"strconv"
)

func ComponentsDetection() {
	if config.DEBUGGING {
		defer core.StartBenchmark("ComponentsDetection()", false).Stop()
	}
	core.ResetComponents()
	for i, row := range core.XlsmFiles[0].Content {
		if i >= core.Filters.Header {
			quantity, err := strconv.Atoi(row[core.Filters.Quantity])
			if err != nil {
				fmt.Println("Quantity not found.", row)
				continue
			}
			component := core.Component{
				Quantity:         quantity,
				Mpn:              row[core.Filters.Mpn],
				UserDescription:  row[core.Filters.Description],
				Designator:       row[core.Filters.Designator],
				UserManufacturer: row[core.Filters.Manufacturer],
			}
			core.OldComponents = append(core.OldComponents, component)
		}
	}
	for i, row := range core.XlsmFiles[1].Content {
		if i >= core.Filters.Header {
			quantity, err := strconv.Atoi(row[core.Filters.Quantity])
			if err != nil {
				fmt.Println("Quantity not found.", row)
				continue
			}
			component := core.Component{
				Quantity:         quantity,
				Mpn:              row[core.Filters.Mpn],
				UserDescription:  row[core.Filters.Description],
				Designator:       row[core.Filters.Designator],
				UserManufacturer: row[core.Filters.Manufacturer],
			}
			core.NewComponents = append(core.NewComponents, component)
		}
	}
}
