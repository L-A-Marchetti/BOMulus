package report

import (
	"core"
)

// Function to find Out of Stock components.
func OutOfStockComp() ([]core.Component, []int) {
	OutOfStock := []core.Component{}
	compIdx := []int{}
	for i, component := range core.Components {
		if component.Availability == "" && component.OldRow == -1 && component.Analyzed {
			OutOfStock = append(OutOfStock, component)
			compIdx = append(compIdx, i)
		}
	}
	return OutOfStock, compIdx
}

// Function to find risky life cycle components.
func RiskyLSSComp() ([]core.Component, []int) {
	riskylss := []core.Component{}
	compIdx := []int{}
	for i, component := range core.Components {
		if component.LifecycleStatus != "" && component.LifecycleStatus != "New Product" && component.LifecycleStatus != "New at Mouser" && component.OldRow == -1 && component.Analyzed {
			riskylss = append(riskylss, component)
			compIdx = append(compIdx, i)
		}
	}
	return riskylss, compIdx
}
