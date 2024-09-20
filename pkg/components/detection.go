package components

import (
	"config"
	"core"
	"strconv"
)

func ComponentsDetection() {
	if config.DEBUGGING {
		defer core.StartBenchmark("ComponentsDetection()", false).Stop()
	}
	core.ResetComponents()
	for i, row := range core.XlsmFiles[0].Content {
		if i >= core.Filters[0].Header {
			quantity, err := strconv.Atoi(row[core.Filters[0].Quantity])
			if err != nil {
				continue
			}
			component := core.Component{
				Quantity:         quantity,
				Mpn:              row[core.Filters[0].Mpn],
				UserDescription:  row[core.Filters[0].Description],
				Designator:       row[core.Filters[0].Designator],
				UserManufacturer: row[core.Filters[0].Manufacturer],
			}
			core.OldComponents = append(core.OldComponents, component)
		}
	}
	for i, row := range core.XlsmFiles[1].Content {
		if i >= core.Filters[1].Header {
			quantity, err := strconv.Atoi(row[core.Filters[1].Quantity])
			if err != nil {
				continue
			}
			component := core.Component{
				Quantity:         quantity,
				Mpn:              row[core.Filters[1].Mpn],
				UserDescription:  row[core.Filters[1].Description],
				Designator:       row[core.Filters[1].Designator],
				UserManufacturer: row[core.Filters[1].Manufacturer],
			}
			core.NewComponents = append(core.NewComponents, component)
		}
	}
}
