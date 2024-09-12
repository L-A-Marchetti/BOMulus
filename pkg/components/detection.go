package components

import (
	"config"
	"core"
	"fmt"
	"strconv"
)

/*
// Detect components, can be updated with more specs.
func ComponentsDetection() {
	if config.DEBUGGING {
		defer core.StartBenchmark("ComponentsDetection()", false).Stop()
	}
	core.ResetComponents()
	for _, delta := range core.XlsmDeltas {
		colSafety(delta)
		switch delta.Operator {
		case "EQUAL":
			quantity, err := strconv.Atoi(core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Quantity])
			if err != nil {
				return
			}
			component := core.Component{
				Operator:        "EQUAL",
				NewRow:          delta.NewRow,
				OldRow:          -1,
				Quantity:        quantity,
				Mpn:             core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Mpn],
				UserDescription: core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Description]}
			core.Components = append(core.Components, component)
		case "INSERT":
			quantity, err := strconv.Atoi(core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Quantity])
			if err != nil {
				return
			}
			component := core.Component{
				Operator:        "INSERT",
				NewRow:          delta.NewRow,
				OldRow:          -1,
				Quantity:        quantity,
				Mpn:             core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Mpn],
				UserDescription: core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Description]}
			core.Components = append(core.Components, component)
		case "DELETE":
			quantity, err := strconv.Atoi(core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Quantity])
			if err != nil {
				return
			}
			component := core.Component{
				Operator:        "DELETE",
				OldRow:          delta.OldRow,
				NewRow:          -1,
				Quantity:        quantity,
				Mpn:             core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Mpn],
				UserDescription: core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Description]}
			core.Components = append(core.Components, component)
		case "UPDATE":
			oldQuantity, err := strconv.Atoi(core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Quantity])
			if err != nil {
				return
			}
			oldComponent := core.Component{
				Operator:        "UPDATE",
				OldRow:          delta.OldRow,
				NewRow:          -1,
				Quantity:        oldQuantity,
				Mpn:             core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Mpn],
				UserDescription: core.XlsmFiles[0].Content[delta.OldRow][core.Filters.Description]}
			core.Components = append(core.Components, oldComponent)
			newQuantity, err := strconv.Atoi(core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Quantity])
			if err != nil {
				return
			}
			newComponent := core.Component{
				Operator:        "UPDATE",
				NewRow:          delta.NewRow,
				OldRow:          -1,
				Quantity:        newQuantity,
				Mpn:             core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Mpn],
				UserDescription: core.XlsmFiles[1].Content[delta.NewRow][core.Filters.Description]}
			core.Components = append(core.Components, newComponent)
		}
	}
}
*/

func ComponentsDetection() {
	if config.DEBUGGING {
		defer core.StartBenchmark("ComponentsDetection()", false).Stop()
	}
	core.ResetComponents()
	for i, row := range core.XlsmFiles[0].Content {
		if i >= core.Filters.Header {
			quantity, err := strconv.Atoi(row[core.Filters.Quantity])
			if err != nil {
				fmt.Println("Quantity not found.")
				return
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
				fmt.Println("Quantity not found.")
				return
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
