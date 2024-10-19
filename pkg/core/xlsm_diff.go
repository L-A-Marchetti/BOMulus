package core

import "config"

func XlsmDiff(v1, v2 []Component) {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}
	oldComponentsGrouped := groupByMpn(v1)
	var newComponentsGrouped []Component
	if v2 != nil {
		newComponentsGrouped = groupByMpn(v2)
	} else {
		newComponentsGrouped = oldComponentsGrouped
	}

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
				Diff.EqualCount++
				Diff.OldQuantity += component.Quantity
				Diff.NewQuantity += component.Quantity
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
				Diff.UpdateCount++
				Diff.OldQuantity += component.OldQuantity
				Diff.NewQuantity += component.NewQuantity
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
			Diff.InsertCount++
			Diff.NewQuantity += component.Quantity
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
			Diff.DeleteCount++
			Diff.OldQuantity += component.Quantity
		}
	}
}
