package components

import (
	"core"
)

// Calculate total quantity of components.
func CompTotalQuantity() int {
	total := 0
	for _, component := range core.Components {
		total += component.Quantity
	}
	return total
}

// To find a component with a row reference.
func FindComponentRowId(idx int) int {
	for i, component := range core.Components {
		if component.NewRow == idx {
			return i
		}
	}
	return -1
}
