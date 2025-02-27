/*
* Package: components
* File: pricing.go
*
* Description:
* This file contains functions for calculating prices of components based on
* their quantities and price breaks.
*
* Main Functions:
* - QuantityPrice: Calculates prices for all components based on a given quantity.
* - priceCalculator: Calculates the price for a single component based on its
*   quantity and price breaks also handle minimum quantity warnings.
* - convertPrice: Converts a price string to a float64 value, handling different
*   currency formats.
*
* Input:
* - quantity (int): The number of electronic boards to be produced.
* - core.Components ([]Component): A slice of components to process.
*
* Output:
* - PriceCalculationResult: Contains the calculated prices and related information.
* - error: Any error encountered during the calculation process.
*
* Note:
* This code assumes that components have been previously analyzed and have
* valid price breaks. It handles various component states (INSERT, DELETE,
* EQUAL, UPDATE) and calculates prices accordingly. Error handling for
* invalid inputs or unexpected scenarios is implemented throughout the code.
 */

package components

import (
	"core"
	"fmt"
	"strconv"
	"strings"
	"workspaces"
)

type PriceCalculationResult struct {
	Quantity          int     `json:"quantity"`
	OrderPrice        float64 `json:"orderPrice"`
	OldPrice          float64
	UnitPrice         float64  `json:"unitPrice"`
	UnitPriceDiff     float64  `json:"unitPriceDiff"`
	Currency          string   `json:"currency"`
	MinimumQuantities []string `json:"minimumQuantities"`
}

// QuantityPrice calculates the price for a given quantity of components
func QuantityPrice(activeWorkspace workspaces.Workspace, quantity int) (PriceCalculationResult, error) {
	result := PriceCalculationResult{}
	// Initialize MinimumQuantities as an empty slice to avoid null in JSON
	result.MinimumQuantities = []string{}
	var currency string
	// Iterate through all components
	for i, component := range core.Components {
		// Skip components that are not analyzed or have no price breaks
		if !component.Analyzed || len(component.PriceBreaks) == 0 {
			continue
		}
		// Process component based on its operator
		switch component.Operator {
		case "INSERT":
			// Calculate price for a new component
			price, minQty, err := multisourcePriceCalculator(component, quantity, &currency, i)
			if err != nil {
				return result, err
			}
			result.OrderPrice += price
			result.MinimumQuantities = append(result.MinimumQuantities, minQty...)
		case "DELETE":
			// Calculate price for a component being removed
			price, _, err := multisourcePriceCalculator(component, quantity, &currency, i)
			if err != nil {
				return result, err
			}
			result.OldPrice += price
		case "EQUAL":
			// Calculate price for an unchanged component
			price, minQty, err := multisourcePriceCalculator(component, quantity, &currency, i)
			if err != nil {
				return result, err
			}
			result.OrderPrice += price
			result.OldPrice += price
			result.MinimumQuantities = append(result.MinimumQuantities, minQty...)
		case "UPDATE":
			// Calculate old and new prices for an updated component
			oldComponent := component
			oldComponent.Quantity = component.OldQuantity
			oldPrice, _, err := multisourcePriceCalculator(oldComponent, quantity, &currency, i)
			if err != nil {
				return result, err
			}
			result.OldPrice += oldPrice
			newComponent := component
			newComponent.Quantity = component.NewQuantity
			newPrice, minQty, err := multisourcePriceCalculator(newComponent, quantity, &currency, i)
			if err != nil {
				return result, err
			}
			result.OrderPrice += newPrice
			result.MinimumQuantities = append(result.MinimumQuantities, minQty...)
		default:
			return result, fmt.Errorf("unknown operator: %s", component.Operator)
		}
	}
	// Calculate unit prices if quantity is greater than zero
	if quantity > 0 {
		result.UnitPrice = result.OrderPrice / float64(quantity)
		result.UnitPriceDiff = (result.OrderPrice - result.OldPrice) / float64(quantity)
	}
	result.Currency = currency
	result.Quantity = quantity
	go workspaces.UpdateAllBMLSPricing(activeWorkspace)
	return result, nil
}

// convertPrice converts a price string to a float64 value
func convertPrice(price, currency string) (float64, error) {
	// Remove whitespace and replace comma with dot for decimal
	price = strings.TrimSpace(price)
	price = strings.ReplaceAll(price, ",", ".")
	// Remove currency symbols based on the currency type
	switch currency {
	case "EUR":
		price = strings.TrimRight(price, " €")
	case "USD":
		price = strings.TrimLeft(price, "$")
	}
	// Convert string to float
	return strconv.ParseFloat(price, 64)
}

// multisourcePriceCalculator calculates the price for a single component across multiple suppliers
func multisourcePriceCalculator(component core.Component, quantity int, currency *string, id int) (float64, []string, error) {
	totalQuantity := component.Quantity * quantity
	bestMoq := 0
	bestMoqPrice := .0
	var bestPrice float64
	var bestSupplier string
	var warnings []string // To collect warnings if no valid price is found

	// Iterate through suppliers to find the best price
	for i, msPriceBreak := range component.PriceBreaks {
		price, minQtyWarnings, moq, err := bestPriceFromSupplier(msPriceBreak, totalQuantity, currency, component)
		supplier := component.PriceBreaks[i].Supplier
		if err != nil {
			// Add warning for this supplier if price calculation fails
			warnings = append(warnings, fmt.Sprintf("Error for supplier %s, component %s: %v", msPriceBreak.Supplier, component.Mpn, err))
			continue
		}
		// If no valid price is found for this supplier, add its MOQ warnings
		if moq != -1 {
			warnings = append(warnings, minQtyWarnings...)
			if bestMoq == 0 || price < bestMoqPrice {
				bestMoq = moq
				bestSupplier = supplier
				bestMoqPrice = price
			}
			continue
		}
		// Update best price if found
		if bestPrice == 0 || price < bestPrice {
			bestPrice = price
			bestSupplier = supplier
		}
	}

	// If no valid price was found, return an error with collected warnings
	if bestPrice == 0 {
		if len(component.PriceBreaks) > 0 {
			core.Components[id].CalculatedPrice.IsMoqNotReached = true
			core.Components[id].CalculatedPrice.Moq = strconv.Itoa(bestMoq)
			core.Components[id].CalculatedPrice.BestPrice = fmt.Sprintf("%f", bestMoqPrice)
			core.Components[id].CalculatedPrice.BestUnitPrice = fmt.Sprintf("%f", bestMoqPrice/float64(totalQuantity))
			core.Components[id].CalculatedPrice.BestSupplier = bestSupplier
		}
		return bestMoqPrice, warnings, nil
	}

	// If a valid price was found, clear warnings
	core.Components[id].CalculatedPrice.IsMoqNotReached = false
	core.Components[id].CalculatedPrice.Moq = ""
	core.Components[id].CalculatedPrice.BestPrice = fmt.Sprintf("%f", bestPrice)
	core.Components[id].CalculatedPrice.BestUnitPrice = fmt.Sprintf("%f", bestPrice/float64(totalQuantity))
	core.Components[id].CalculatedPrice.BestSupplier = bestSupplier
	return bestPrice, nil, nil
}

// bestPriceFromSupplier determines the best price from a single supplier's price breaks
func bestPriceFromSupplier(msPriceBreak core.MSPriceBreaks, totalQuantity int, currency *string, component core.Component) (float64, []string, int, error) {
	var componentPrice float64
	var warnings []string

	// Ensure there are price breaks to analyze
	if len(msPriceBreak.Value) == 0 {
		return 0, nil, -1, fmt.Errorf("no PriceBreaks for supplier %s", msPriceBreak.Supplier)
	}

	// Set currency if not already set
	if *currency == "" {
		*currency = msPriceBreak.Value[0].Currency
	}

	// Check if total quantity is below the minimum price break quantity
	if totalQuantity < msPriceBreak.Value[0].Quantity {
		// Log a warning but do not calculate price
		warnings = append(warnings, fmt.Sprintf("[%s] MOQ (%d) not reached for supplier: %s", component.Mpn, msPriceBreak.Value[0].Quantity, msPriceBreak.Supplier))
		priceValue, err := convertPrice(msPriceBreak.Value[0].Price, msPriceBreak.Value[0].Currency)
		if err != nil {
			return 0, nil, -1, fmt.Errorf("error converting price for supplier %s: %v", msPriceBreak.Supplier, err)
		}
		return float64(msPriceBreak.Value[0].Quantity) * priceValue, warnings, msPriceBreak.Value[0].Quantity, nil
	}

	// Find the appropriate price break
	for i, priceBreak := range msPriceBreak.Value {
		priceValue, err := convertPrice(priceBreak.Price, priceBreak.Currency)
		if err != nil {
			return 0, nil, -1, fmt.Errorf("error converting price for supplier %s: %v", msPriceBreak.Supplier, err)
		}
		if totalQuantity >= priceBreak.Quantity {
			componentPrice = float64(totalQuantity) * priceValue
			// If it's the last price break or the next one exceeds the quantity, return the price
			if i == len(msPriceBreak.Value)-1 || totalQuantity < msPriceBreak.Value[i+1].Quantity {
				return componentPrice, nil, -1, nil
			}
		}
	}

	// This should never happen if price breaks are correctly ordered
	return 0, nil, -1, fmt.Errorf("unable to calculate price for supplier %s", msPriceBreak.Supplier)
}
