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

// Fonction pour calculer le prix en fonction de la quantité.
func QuantityPrice(quantity int) (float64, float64, float64, float64, []string, string) {
	minimumQuantity := []string{}
	oldPrice := 0.0
	newPrice := 0.0
	currency := ""
	for _, component := range core.Components {
		if component.Analyzed {
			if len(component.PriceBreaks) == 0 {
				continue
			}
			switch component.Operator {
			case "INSERT":
				price, minQty := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false, &currency)
				newPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			case "DELETE":
				price, _ := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false, &currency)
				oldPrice += price
			case "EQUAL":
				price, minQty := priceCalculator(component.Quantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false, &currency)
				newPrice += price
				oldPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			case "UPDATE":
				price, _ := priceCalculator(component.OldQuantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, false, &currency)
				oldPrice += price
				price, minQty := priceCalculator(component.NewQuantity, quantity, component.PriceBreaks, component.Mpn, component.Operator, true, &currency)
				newPrice += price
				if len(minQty) != 0 {
					minimumQuantity = append(minimumQuantity, minQty...)
				}
			}
		}
	}
	priceDiff := newPrice - oldPrice
	unitPrice := newPrice / float64(quantity)
	unitPriceDiff := priceDiff / float64(quantity)
	return oldPrice, newPrice, unitPrice, unitPriceDiff, minimumQuantity, currency
}

func priceCalculator(compQuantity, quantity int, priceBreaks []core.PriceBreak, mpn, operator string, isNewQuantity bool, currency *string) (float64, []string) {
	minimumQuantity := []string{}
	componentPrice := 0.0

	if len(priceBreaks) == 0 {
		fmt.Printf("priceCalculator: Pas de PriceBreaks pour le composant %s\n", mpn)
		return 0.0, nil
	}

	if *currency == "" {
		*currency = priceBreaks[0].Currency
	}

	totalQuantity := compQuantity * quantity

	priceFound := false

	for _, priceBreak := range priceBreaks {
		pbQuantity := priceBreak.Quantity

		convPrice := 0.0
		var err error
		if priceBreak.Currency == "EUR" {
			convPrice, err = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(priceBreak.Price, " €"), ",", "."), 64)
		} else if priceBreak.Currency == "USD" {
			convPrice, err = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(priceBreak.Price, "$"), ",", "."), 64)
		}
		if err != nil {
			fmt.Printf("priceCalculator: Erreur de conversion du prix pour %s: %v\n", mpn, err)
			continue
		}

		if totalQuantity >= pbQuantity {
			componentPrice = float64(totalQuantity) * convPrice
			priceFound = true

		}
	}

	if !priceFound {
		// Aucun palier de prix trouvé pour la quantité donnée
		convPrice := 0.0
		var err error
		lastPriceBreak := priceBreaks[0] // Par défaut, le premier palier
		if len(priceBreaks) > 0 {
			lastPriceBreak = priceBreaks[0]
		}
		if lastPriceBreak.Currency == "EUR" {
			convPrice, err = strconv.ParseFloat(strings.ReplaceAll(strings.TrimRight(lastPriceBreak.Price, " €"), ",", "."), 64)
		} else if lastPriceBreak.Currency == "USD" {
			convPrice, err = strconv.ParseFloat(strings.ReplaceAll(strings.TrimLeft(lastPriceBreak.Price, "$"), ",", "."), 64)
		}
		if err != nil {
			fmt.Printf("priceCalculator: Erreur de conversion du prix pour %s: %v\n", mpn, err)
		} else {
			componentPrice = float64(totalQuantity) * convPrice
		}
		if (operator == "INSERT") || (operator == "EQUAL") || (operator == "UPDATE" && isNewQuantity) {
			minimumQuantity = append(minimumQuantity, fmt.Sprintf("MOQ (%d) not reached pour for component : %s", lastPriceBreak.Quantity, mpn))
		}

	}
	return componentPrice, minimumQuantity
}
