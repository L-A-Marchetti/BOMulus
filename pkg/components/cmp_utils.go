package components

import (
	"core"
)

// Calculate total quantity of components. (still need to specify only new row)
func CompTotalQuantity() int {
	total := 0
	for _, component := range core.Components {
		if component.NewRow != -1 {
			total += component.Quantity
		}
	}
	return total
}

// Calculate components quantities diff between old and new BOM
func CompQuantityDiff() int {
	oldDiff := 0
	newDiff := 0
	for _, component := range core.Components {
		if component.OldRow != -1 && component.Operator != "EQUAL" {
			oldDiff += component.Quantity
		} else if component.NewRow != -1 && component.Operator != "EQUAL" {
			newDiff += component.Quantity
		}
	}
	diff := newDiff - oldDiff
	return diff
}

// To find a component with a row reference.
func FindComponentRowId(idx int, isOld bool) int {
	for i, component := range core.Components {
		if isOld && component.OldRow == idx {
			return i
		} else if !isOld && component.NewRow == idx {
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
