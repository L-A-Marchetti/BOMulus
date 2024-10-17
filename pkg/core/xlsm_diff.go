package core

import (
	"config"
)

func XlsmDiff() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}

	newComponentsGrouped := groupByMpn(NewComponents)
	oldComponentsGrouped := groupByMpn(OldComponents)

	compId := 0

	for _, newComponent := range newComponentsGrouped {
		matchFound := false
		for _, oldComponent := range oldComponentsGrouped {
			if newComponent.Mpn == oldComponent.Mpn &&
				newComponent.Quantity == oldComponent.Quantity {
				component := newComponent
				component.Operator = "EQUAL"
				component.Id = compId
				compId++
				Components = append(Components, component)
				Filters[1].EqualCount++
				Filters[1].OldQuantity += component.Quantity
				Filters[1].NewQuantity += component.Quantity
				matchFound = true
				break
			} else if newComponent.Mpn == oldComponent.Mpn {
				component := newComponent
				component.Operator = "UPDATE"
				component.OldQuantity = oldComponent.Quantity
				component.NewQuantity = newComponent.Quantity
				component.Id = compId
				compId++
				Components = append(Components, component)
				Filters[1].UpdateCount++
				Filters[1].OldQuantity += component.OldQuantity
				Filters[1].NewQuantity += component.NewQuantity
				matchFound = true
				break
			}
		}
		if !matchFound {
			component := newComponent
			component.Operator = "INSERT"
			component.Id = compId
			compId++
			Components = append(Components, component)
			Filters[1].InsertCount++
			Filters[1].NewQuantity += component.Quantity
		}
	}

	for _, oldComponent := range oldComponentsGrouped {
		matchFound := false
		for _, newComponent := range newComponentsGrouped {
			if newComponent.Mpn == oldComponent.Mpn {
				matchFound = true
				break
			}
		}
		if !matchFound {
			component := oldComponent
			component.Operator = "DELETE"
			component.Id = compId
			compId++
			Components = append(Components, component)
			Filters[1].DeleteCount++
			Filters[1].OldQuantity += component.Quantity
		}
	}
}
