package report

import (
	"core"
	"strconv"
	"strings"
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

// Function to find manufacturer messages.
func ManufacturerMessages() ([]core.Component, []int) {
	ManufacturerMessages := []core.Component{}
	compIdx := []int{}
	for i, component := range core.Components {
		if len(component.InfoMessages) != 0 && component.OldRow == -1 && component.Analyzed {
			ManufacturerMessages = append(ManufacturerMessages, component)
			compIdx = append(compIdx, i)
		}
	}
	return ManufacturerMessages, compIdx
}

// Function to calculate min and max total price.
func MinMaxPrice() (float64, float64, float64, float64) {
	newMax := 0.0
	newMin := 0.0
	oldMax := 0.0
	oldMin := 0.0
	for _, component := range core.Components {
		if component.Analyzed && component.Operator == "EQUAL" && len(component.PriceBreaks) != 0 {
			maxPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
			minPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			newMax += maxPrice
			newMin += minPrice
			oldMax += maxPrice
			oldMin += minPrice
		} else if component.Analyzed && component.Operator != "EQUAL" && component.OldRow == -1 && len(component.PriceBreaks) != 0 {
			maxPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
			minPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			newMax += maxPrice
			newMin += minPrice
		} else if component.Analyzed && component.Operator != "EQUAL" && component.NewRow == -1 && len(component.PriceBreaks) != 0 {
			maxPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
			minPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			oldMax += maxPrice
			oldMin += minPrice
		}
	}
	minPriceDiff := newMin - oldMin
	maxPriceDiff := newMax - oldMax
	return newMin, newMax, minPriceDiff, maxPriceDiff
}

// Function to find components with not 100% matching manufacturer part number.
func MismatchMpn() []core.Component {
	mismatchComp := []core.Component{}
	for _, component := range core.Components {
		if len(component.MismatchMpn) != 0 && component.OldRow == -1 {
			mismatchComp = append(mismatchComp, component)
		}
	}
	return mismatchComp
}
