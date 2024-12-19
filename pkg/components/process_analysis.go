/*
* Package: components
* File: process_analysis.go
*
* Description:
* This file contains functions for processing and updating component information
* based on API responses from a parts supplier. It handles the analysis of
* components, including exact matches and alternative suggestions.
*
* Functions:
* - processAnalysis: Processes the API response and updates component information.
* - processComponent: Updates an existing component or creates a new one based on analyzed data.
* - convertPriceBreaks: Converts API price breaks to core price breaks.
*
* Input:
* - apiResponse (ApiResponse): Contains the search results and potential errors from the API.
* - i (int): Index of the component in the core.Components slice to be processed.
*
* Note:
* This code assumes that the API response contains at least one analyzed component
* in the SearchResults.Parts slice. Error handling for empty responses should be
* implemented at a higher level if necessary.
 */

package components

import (
	"core"
	"fmt"
	"strconv"
	"time"
)

// processAnalysis processes the API response and updates the component information
// It handles both exact matches and alternative components
func processAnalysis(apiResponse ApiResponse, response Response, i int, supplier string) {
	switch supplier {
	case "Mouser":
		// Get the analyzed components from the API response
		analyzedComponents := apiResponse.SearchResults.Parts
		// Get a reference to the current component being processed
		currentComponent := &core.Components[i]
		// Check if the current component's MPN matches 100% the API response
		if currentComponent.Mpn == analyzedComponents[0].ManufacturerPartNumber {
			// Update the existing component with the analyzed data
			processComponent(currentComponent, analyzedComponents[0], true, supplier)
		} else {
			// If no exact match, process all analyzed components as alternatives
			for _, analyzedPart := range analyzedComponents {
				alternativeMpn := processComponent(nil, analyzedPart, false, supplier)
				currentComponent.MismatchMpn = append(currentComponent.MismatchMpn, alternativeMpn)
			}
		}
		// Validate the analysis
		if len(apiResponse.Errors) == 0 {
			currentComponent.Analyzed = true
			currentComponent.LastRefresh = time.Now()
		}
	case "Digikey":
		// Get the analyzed components from the API response
		analyzedComponents := response.ExactMatches
		// Get a reference to the current component being processed
		currentComponent := &core.Components[i]
		// Check if the current component's MPN matches 100% the API response
		if currentComponent.Mpn == analyzedComponents[0].ManufacturerProductNumber {
			// Update the existing component with the analyzed data
			dkProcessComponent(currentComponent, analyzedComponents[0], true, supplier, response.SearchLocaleUsed.Currency)
		} else {
			// If no exact match, process all analyzed components as alternatives
			//for _, analyzedPart := range analyzedComponents {
			//	alternativeMpn := processComponent(nil, analyzedPart, false, supplier)
			//	currentComponent.MismatchMpn = append(currentComponent.MismatchMpn, alternativeMpn)
			//}
		}
		// Validate the analysis
		if len(response.ExactMatches) != 0 {
			currentComponent.Analyzed = true
			currentComponent.LastRefresh = time.Now()
		}
	}
}

// dkProcessComponent updates an existing component or creates a new one
// based on the analyzed part data
func dkProcessComponent(existingComponent *core.Component, analyzed Product, isUpdate bool, supplier string, currency string) core.Component {
	// Check if th call is an update or an alternative component.
	var component core.Component
	if isUpdate {
		component = *existingComponent
	} else {
		component = core.Component{}
	}
	// Update component fields with analyzed data
	component.Mpn = analyzed.ManufacturerProductNumber
	component.ImagePath = append(component.ImagePath, core.MSValue{Supplier: supplier, Value: analyzed.PhotoUrl})
	component.Availability = append(component.Availability, core.MSValue{Supplier: supplier, Value: strconv.Itoa(analyzed.QuantityAvailable)})
	component.DataSheetUrl = append(component.DataSheetUrl, core.MSValue{Supplier: supplier, Value: analyzed.DatasheetUrl})
	component.LifecycleStatus = append(component.LifecycleStatus, core.MSValue{Supplier: supplier, Value: analyzed.ProductStatus.Status})
	component.ROHSStatus = append(component.ROHSStatus, core.MSValue{Supplier: supplier, Value: analyzed.Classifications.RohsStatus})
	//component.SuggestedReplacement = analyzed.SuggestedReplacement
	component.PriceBreaks = append(component.PriceBreaks, core.MSPriceBreaks{Supplier: supplier, Value: dkConvertPriceBreaks(analyzed.ProductVariations[1].StandardPricing, currency)})
	//component.InfoMessages = append(component.InfoMessages, analyzed.InfoMessages...)
	component.SupplierDescription = append(component.SupplierDescription, core.MSValue{Supplier: supplier, Value: analyzed.Description.ProductDescription + " | " + analyzed.Description.DetailedDescription})
	component.SupplierManufacturer = append(component.SupplierManufacturer, core.MSValue{Supplier: supplier, Value: analyzed.Manufacturer.Name})
	component.Category = append(component.Category, core.MSValue{Supplier: supplier, Value: analyzed.Category.Name})
	component.ProductDetailUrl = append(component.ProductDetailUrl, core.MSValue{Supplier: supplier, Value: analyzed.ProductUrl})
	// If updating an existing component, update the original
	if isUpdate {
		*existingComponent = component
	}
	return component
}

// processComponent updates an existing component or creates a new one
// based on the analyzed part data
func processComponent(existingComponent *core.Component, analyzed Part, isUpdate bool, supplier string) core.Component {
	// Check if th call is an update or an alternative component.
	var component core.Component
	if isUpdate {
		component = *existingComponent
	} else {
		component = core.Component{}
	}
	// Update component fields with analyzed data
	component.Mpn = analyzed.ManufacturerPartNumber
	component.ImagePath = append(component.ImagePath, core.MSValue{Supplier: supplier, Value: analyzed.ImagePath})
	component.Availability = append(component.Availability, core.MSValue{Supplier: supplier, Value: analyzed.Availability})
	component.DataSheetUrl = append(component.DataSheetUrl, core.MSValue{Supplier: supplier, Value: analyzed.DataSheetUrl})
	component.LifecycleStatus = append(component.LifecycleStatus, core.MSValue{Supplier: supplier, Value: analyzed.LifecycleStatus})
	component.ROHSStatus = append(component.ROHSStatus, core.MSValue{Supplier: supplier, Value: analyzed.ROHSStatus})
	component.SuggestedReplacement = append(component.SuggestedReplacement, core.MSValue{Supplier: supplier, Value: analyzed.SuggestedReplacement})
	component.PriceBreaks = append(component.PriceBreaks, core.MSPriceBreaks{Supplier: supplier, Value: convertPriceBreaks(analyzed.PriceBreaks)})
	component.InfoMessages = append(component.InfoMessages, analyzed.InfoMessages...)
	component.SupplierDescription = append(component.SupplierDescription, core.MSValue{Supplier: supplier, Value: analyzed.Description})
	component.SupplierManufacturer = append(component.SupplierManufacturer, core.MSValue{Supplier: supplier, Value: analyzed.Manufacturer})
	component.Category = append(component.Category, core.MSValue{Supplier: supplier, Value: analyzed.Category})
	component.ProductDetailUrl = append(component.ProductDetailUrl, core.MSValue{Supplier: supplier, Value: analyzed.ProductDetailUrl})
	// If updating an existing component, update the original
	if isUpdate {
		*existingComponent = component
	}
	return component
}

// convertPriceBreaks converts API price breaks to core price breaks
func convertPriceBreaks(apiPriceBreaks []PriceBreak) []core.PriceBreak {
	priceBreaks := make([]core.PriceBreak, len(apiPriceBreaks))
	for i, pb := range apiPriceBreaks {
		priceBreaks[i] = core.PriceBreak(pb)
	}
	return priceBreaks
}

// dkConvertPriceBreaks converts dk API price breaks to core price breaks
func dkConvertPriceBreaks(apiPriceBreaks []Pricing, currency string) []core.PriceBreak {
	priceBreaks := make([]core.PriceBreak, len(apiPriceBreaks))
	for i, pb := range apiPriceBreaks {
		priceBreaks[i] = core.PriceBreak{Quantity: pb.BreakQuantity, Price: fmt.Sprintf("%f", pb.UnitPrice), Currency: currency}
	}
	return priceBreaks
}
