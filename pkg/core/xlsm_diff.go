package core

import (
	"config"
)

func groupByMpn(components []Component) []Component {
	grouped := make(map[string]Component)
	for _, component := range components {
		if existing, found := grouped[component.Mpn]; found {
			existing.Quantity += component.Quantity
			grouped[component.Mpn] = existing
		} else {
			grouped[component.Mpn] = component
		}
	}
	var result []Component
	for _, component := range grouped {
		result = append(result, component)
	}

	return result
}

func XlsmDiff() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}

	newComponentsGrouped := groupByMpn(NewComponents)
	oldComponentsGrouped := groupByMpn(OldComponents)

	for _, newComponent := range newComponentsGrouped {
		matchFound := false
		for _, oldComponent := range oldComponentsGrouped {
			if newComponent.Mpn == oldComponent.Mpn &&
				newComponent.Quantity == oldComponent.Quantity {
				component := newComponent
				component.Operator = "EQUAL"
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
			Components = append(Components, component)
			Filters[1].DeleteCount++
			Filters[1].OldQuantity += component.Quantity
		}
	}

}