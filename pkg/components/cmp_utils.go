package components

import (
	"core"
)

// Calculate total quantity of components. (still need to specify only new row)
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

// Determine number of components analyzed by the API.
func CmpAnalyzed() int {
	c := 0
	for _, component := range core.Components {
		if component.Analyzed {
			c++
		}
	}
	return c
}
