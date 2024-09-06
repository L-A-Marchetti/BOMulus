package components

import (
	"core"
)

func appendAnalysis(apiResponse ApiResponse, i int) {
	if core.Components[i].Mpn == apiResponse.SearchResults.Parts[0].ManufacturerPartNumber {
		core.Components[i].ImagePath = apiResponse.SearchResults.Parts[0].ImagePath
		core.Components[i].Availability = apiResponse.SearchResults.Parts[0].Availability
		core.Components[i].DataSheetUrl = apiResponse.SearchResults.Parts[0].DataSheetUrl
		core.Components[i].LifecycleStatus = apiResponse.SearchResults.Parts[0].LifecycleStatus
		core.Components[i].ROHSStatus = apiResponse.SearchResults.Parts[0].ROHSStatus
		core.Components[i].SuggestedReplacement = apiResponse.SearchResults.Parts[0].SuggestedReplacement
		for _, priceBreak := range apiResponse.SearchResults.Parts[0].PriceBreaks {
			core.Components[i].PriceBreaks = append(core.Components[i].PriceBreaks, core.PriceBreak(priceBreak))
		}
		core.Components[i].InfoMessages = append(core.Components[i].InfoMessages, apiResponse.SearchResults.Parts[0].InfoMessages...)
		core.Components[i].SupplierDescription = apiResponse.SearchResults.Parts[0].Description
		core.Components[i].Manufacturer = apiResponse.SearchResults.Parts[0].Manufacturer
		core.Components[i].Category = apiResponse.SearchResults.Parts[0].Category
		core.Components[i].ProductDetailUrl = apiResponse.SearchResults.Parts[0].ProductDetailUrl

	} else {
		for _, part := range apiResponse.SearchResults.Parts {
			alternativeMpn := core.Component{}
			alternativeMpn.Mpn = part.ManufacturerPartNumber
			alternativeMpn.SupplierDescription = part.Description
			core.Components[i].MismatchMpn = append(core.Components[i].MismatchMpn, alternativeMpn)
		}
	}
	// Interpret the MPN.
	//MPNInterpreter(i)
	// Load img in the buffer.
	imgFromUrl(i)
	// Validate the analysis
	if len(apiResponse.Errors) == 0 {
		core.Components[i].Analyzed = true
	}
}
