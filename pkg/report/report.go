package report

import (
	"core"
)

func OutOfStockComp() []core.Component {
	OutOfStock := []core.Component{}
	for _, component := range core.Components {
		if component.Availability == "" && component.OldRow == -1 && component.Analyzed {
			OutOfStock = append(OutOfStock, component)
		}
	}
	return OutOfStock
}
