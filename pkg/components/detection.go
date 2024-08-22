package components

import (
	"core"
	"math"
	"strconv"
)

// Detect components, can be updated with more specs.
func ComponentsDetection() {
	core.ResetComponents()
	colSafety := math.Max(math.Max(float64(core.Filters.Quantity), float64(core.Filters.Mpn)), float64(core.Filters.Description))
	for _, delta := range core.XlsmDeltas {
		if int(colSafety) < len(core.XlsmFiles[1].Content[delta.NewRow]) {
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
}
