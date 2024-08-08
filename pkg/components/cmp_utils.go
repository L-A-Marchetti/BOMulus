package components

import "core"

// Calculate total quantity of components.
func CompTotalQuantity() int {
	total := 0
	for _, component := range core.Components {
		total += component.Quantity
	}
	return total
}
