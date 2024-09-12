package core

import (
	"config"
)

func XlsmDiff() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}
	for _, newComponent := range NewComponents {
		matchFound := false
		for _, oldComponent := range OldComponents {
			if newComponent.Mpn == oldComponent.Mpn &&
				newComponent.Quantity == oldComponent.Quantity {
				component := newComponent
				component.Operator = "EQUAL"
				Components = append(Components, component)
				matchFound = true
				break
			} else if newComponent.Mpn == oldComponent.Mpn {
				component := newComponent
				component.Operator = "UPDATE"
				component.OldQuantity = oldComponent.Quantity
				component.NewQuantity = newComponent.Quantity
				Components = append(Components, component)
				matchFound = true
				break
			}
		}
		if !matchFound {
			component := newComponent
			component.Operator = "INSERT"
			Components = append(Components, component)
		}
	}
	for _, oldComponent := range OldComponents {
		matchFound := false
		for _, newComponent := range NewComponents {
			if newComponent.Mpn == oldComponent.Mpn {
				matchFound = true
				break
			}
		}
		if !matchFound {
			component := oldComponent
			component.Operator = "DELETE"
			Components = append(Components, component)
		}
	}
}
