package report

import (
	"core"
	"fmt"
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
			newMax += maxPrice * float64(component.Quantity)
			newMin += minPrice * float64(component.Quantity)
			oldMax += maxPrice * float64(component.Quantity)
			oldMin += minPrice * float64(component.Quantity)
		} else if component.Analyzed && component.Operator != "EQUAL" && component.OldRow == -1 && len(component.PriceBreaks) != 0 {
			maxPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
			minPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			newMax += maxPrice * float64(component.Quantity)
			newMin += minPrice * float64(component.Quantity)
		} else if component.Analyzed && component.Operator != "EQUAL" && component.NewRow == -1 && len(component.PriceBreaks) != 0 {
			maxPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
			minPrice, _ := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			oldMax += maxPrice * float64(component.Quantity)
			oldMin += minPrice * float64(component.Quantity)
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

// Function to find mismatching descriptions between user and supplier.
func MismatchDescription() ([]core.Component, []int) {
	mismatchComp := []core.Component{}
	compIdx := []int{}
	for i, component := range core.Components {
		if component.Analyzed && component.OldRow == -1 && component.SupplierDescription != "" {
			if component.UserDescription != component.SupplierDescription {
				mismatchComp = append(mismatchComp, component)
				compIdx = append(compIdx, i)
			}
		}
	}
	return mismatchComp, compIdx
}

func QuantityPrice(quantity int) (float64, float64, error) {
	totalPrice := 0.0
	oldPrice := 0.0
	newPrice := 0.0
	for _, component := range core.Components {
		if component.Analyzed {
			componentPrice := 0.0
			for _, priceBreak := range component.PriceBreaks {
				if priceBreak.Quantity > component.Quantity*quantity {
					if componentPrice == 0.0 {
						return 0.0, 0.0, fmt.Errorf("minimum quantity for the component %s is %d", component.Mpn, priceBreak.Quantity)
					}
					break
				}
				convPrice, err := strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
				core.ErrorsHandler(err)
				componentPrice = float64(component.Quantity*quantity) * convPrice
			}
			totalPrice += componentPrice
			if component.Operator == "EQUAL" {
				oldPrice += componentPrice
				newPrice += componentPrice
			} else if component.OldRow == -1 {
				newPrice += componentPrice
			} else if component.NewRow == -1 {
				oldPrice += componentPrice
			}
		}
	}
	priceDiff := newPrice - oldPrice
	return totalPrice, priceDiff, nil
}
