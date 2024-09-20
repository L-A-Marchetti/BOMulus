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
		if component.Availability == "" && component.Operator != "DELETE" && component.Analyzed {
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
		if component.LifecycleStatus != "" && component.LifecycleStatus != "New Product" && component.LifecycleStatus != "New at Mouser" && component.Operator != "DELETE" && component.Analyzed {
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
		if len(component.InfoMessages) != 0 && component.Operator != "DELETE" && component.Analyzed {
			ManufacturerMessages = append(ManufacturerMessages, component)
			compIdx = append(compIdx, i)
		}
	}
	return ManufacturerMessages, compIdx
}

// Function to calculate min and max total price.
func MinMaxPrice() (float64, float64, float64, float64, string) {
	currency := ""
	newMax, newMin, oldMax, oldMin := 0.0, 0.0, 0.0, 0.0
	for _, component := range core.Components {
		if component.Analyzed && len(component.PriceBreaks) != 0 {
			maxPrice, minPrice := 0.0, 0.0
			if component.PriceBreaks[0].Currency == "EUR" {
				if currency == "" {
					currency = "€"
				}
				maxPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[0].Price, " €"), ",", "."), 64)
				minPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(component.PriceBreaks[len(component.PriceBreaks)-1].Price, " €"), ",", "."), 64)
			} else if component.PriceBreaks[0].Currency == "USD" {
				if currency == "" {
					currency = "$"
				}
				maxPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(component.PriceBreaks[0].Price, "$"), ",", "."), 64)
				minPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(component.PriceBreaks[len(component.PriceBreaks)-1].Price, "$"), ",", "."), 64)
			}
			if component.Operator == "EQUAL" {
				newMax += maxPrice * float64(component.Quantity)
				newMin += minPrice * float64(component.Quantity)
				oldMax += maxPrice * float64(component.Quantity)
				oldMin += minPrice * float64(component.Quantity)
			} else if component.Operator == "INSERT" {
				newMax += maxPrice * float64(component.Quantity)
				newMin += minPrice * float64(component.Quantity)
			} else if component.Operator == "DELETE" {
				oldMax += maxPrice * float64(component.Quantity)
				oldMin += minPrice * float64(component.Quantity)
			} else if component.Operator == "UPDATE" {
				newMax += maxPrice * float64(component.NewQuantity)
				newMin += minPrice * float64(component.NewQuantity)
				oldMax += maxPrice * float64(component.OldQuantity)
				oldMin += minPrice * float64(component.OldQuantity)
			}
		}
	}
	minPriceDiff := newMin - oldMin
	maxPriceDiff := newMax - oldMax
	return newMin, newMax, minPriceDiff, maxPriceDiff, currency
}

// Function to find components with not 100% matching manufacturer part number.
func MismatchMpn() []core.Component {
	mismatchComp := []core.Component{}
	for _, component := range core.Components {
		if len(component.MismatchMpn) != 0 && component.Operator != "DELETE" {
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
		if component.Analyzed && component.Operator != "DELETE" && component.SupplierDescription != "" {
			if component.UserDescription != component.SupplierDescription {
				mismatchComp = append(mismatchComp, component)
				compIdx = append(compIdx, i)
			}
		}
	}
	return mismatchComp, compIdx
}

/*
func QuantityPrice(quantity int) (float64, float64, []string) {
	minimumQuantity := []string{}
	oldPrice := 0.0
	newPrice := 0.0
	for _, component := range core.Components {
		if component.Analyzed {
			componentPrice := 0.0
			for _, priceBreak := range component.PriceBreaks {
				if priceBreak.Quantity > component.Quantity*quantity {
					if componentPrice == 0.0 {
						convPrice := 0.0
						if priceBreak.Currency == "EUR" {
							convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
						} else if priceBreak.Currency == "USD" {
							convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(priceBreak.Price, "$"), ",", "."), 64)
						}
						componentPrice = float64(component.Quantity*quantity) * convPrice
						minimumQuantity = append(minimumQuantity, fmt.Sprintf("Minimum quantity (%d) not reached for the component: %s", priceBreak.Quantity, component.Mpn))
					}
					break
				}
				convPrice := 0.0
				if priceBreak.Currency == "EUR" {
					convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
				} else if priceBreak.Currency == "USD" {
					convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(priceBreak.Price, "$"), ",", "."), 64)
				}
				componentPrice = float64(component.Quantity*quantity) * convPrice
			}
			if component.Operator == "EQUAL" {
				oldPrice += componentPrice
				newPrice += componentPrice
			} else if component.Operator == "INSERT" {
				newPrice += componentPrice
			} else if component.Operator == "DELETE" {
				oldPrice += componentPrice
			}
		}
	}
	priceDiff := newPrice - oldPrice
	return newPrice, priceDiff, minimumQuantity
}
*/

func QuantityPrice(quantity int) (float64, float64, []string) {
	minimumQuantity := []string{}
	oldPrice := 0.0
	newPrice := 0.0
	for _, component := range core.Components {
		if component.Analyzed {
			switch component.Operator {
			case "INSERT":
				price, minQty := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false)
				newPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			case "DELETE":
				price, _ := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false)
				oldPrice += price
			case "EQUAL":
				price, minQty := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false)
				newPrice += price
				oldPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			case "UPDATE":
				price, _ := priceCalculator(component.OldQuantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false)
				oldPrice += price
				price, minQty := priceCalculator(component.NewQuantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, true)
				newPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			}
		}
	}
	priceDiff := newPrice - oldPrice
	return newPrice, priceDiff, minimumQuantity
}

func priceCalculator(compQuantity, quantity int, priceBreaks []core.PriceBreak, mpn, operator string, isNewQuantity bool) (float64, []string) {
	minimumQuantity := []string{}
	componentPrice := 0.0
	for _, priceBreak := range priceBreaks {
		if priceBreak.Quantity > compQuantity*quantity {
			if componentPrice == 0.0 {
				convPrice := 0.0
				if priceBreak.Currency == "EUR" {
					convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
				} else if priceBreak.Currency == "USD" {
					convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(priceBreak.Price, "$"), ",", "."), 64)
				}
				componentPrice = float64(compQuantity*quantity) * convPrice
				if (operator == "INSERT") || (operator == "EQUAL") || (operator == "UPDATE" && isNewQuantity) {
					minimumQuantity = append(minimumQuantity, fmt.Sprintf("Minimum quantity (%d) not reached for the component: %s", priceBreak.Quantity, mpn))
				}
			}
			break
		}
		convPrice := 0.0
		if priceBreak.Currency == "EUR" {
			convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
		} else if priceBreak.Currency == "USD" {
			convPrice, _ = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(priceBreak.Price, "$"), ",", "."), 64)
		}
		componentPrice = float64(compQuantity*quantity) * convPrice
	}
	return componentPrice, minimumQuantity
}
