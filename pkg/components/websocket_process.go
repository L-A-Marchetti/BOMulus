package components

import (
	"config"
	"core"
	"strconv"
	"time"
)

// func WebsocketProcess(analyzedComponent core.Component) {
// 	for i := 0; i < len(core.Components); i++ {
// 		if core.Components[i].Mpn == analyzedComponent.Mpn {
// 			core.Components[i].ImagePath = append(core.Components[i].ImagePath, analyzedComponent.ImagePath...)
// 			core.Components[i].Availability = append(core.Components[i].Availability, analyzedComponent.Availability...)
// 			core.Components[i].DataSheetUrl = append(core.Components[i].DataSheetUrl, analyzedComponent.DataSheetUrl...)
// 			core.Components[i].LifecycleStatus = append(core.Components[i].LifecycleStatus, analyzedComponent.LifecycleStatus...)
// 			core.Components[i].ROHSStatus = append(core.Components[i].ROHSStatus, analyzedComponent.ROHSStatus...)
// 			core.Components[i].SuggestedReplacement = append(core.Components[i].SuggestedReplacement, analyzedComponent.SuggestedReplacement...)
// 			core.Components[i].PriceBreaks = append(core.Components[i].PriceBreaks, analyzedComponent.PriceBreaks...)
// 			core.Components[i].InfoMessages = append(core.Components[i].InfoMessages, analyzedComponent.InfoMessages...)
// 			core.Components[i].SupplierDescription = append(core.Components[i].SupplierDescription, analyzedComponent.SupplierDescription...)
// 			core.Components[i].SupplierManufacturer = append(core.Components[i].SupplierManufacturer, analyzedComponent.SupplierManufacturer...)
// 			core.Components[i].Category = append(core.Components[i].Category, analyzedComponent.Category...)
// 			core.Components[i].ProductDetailUrl = append(core.Components[i].ProductDetailUrl, analyzedComponent.ProductDetailUrl...)
// 		}
// 	}
// }

func WebsocketProcess(analyzedComponent core.Component) {
	for i := 0; i < len(core.Components); i++ {
		if core.Components[i].Mpn == analyzedComponent.Mpn {
			currency := ""
			// ImagePath
			for _, newImg := range analyzedComponent.ImagePath {
				found := false
				for j, existingImg := range core.Components[i].ImagePath {
					if existingImg.Supplier == newImg.Supplier {
						core.Components[i].ImagePath[j] = newImg
						found = true
						break
					}
				}
				if !found {
					core.Components[i].ImagePath = append(core.Components[i].ImagePath, newImg)
				}
			}

			// Availability
			for _, newAvailability := range analyzedComponent.Availability {
				found := false
				for j, existingAvailability := range core.Components[i].Availability {
					if existingAvailability.Supplier == newAvailability.Supplier {
						core.Components[i].Availability[j] = newAvailability
						found = true
						break
					}
				}
				if !found {
					core.Components[i].Availability = append(core.Components[i].Availability, newAvailability)
				}
			}

			// DataSheetUrl
			for _, newDataSheet := range analyzedComponent.DataSheetUrl {
				found := false
				for j, existingDataSheet := range core.Components[i].DataSheetUrl {
					if existingDataSheet.Supplier == newDataSheet.Supplier {
						core.Components[i].DataSheetUrl[j] = newDataSheet
						found = true
						break
					}
				}
				if !found {
					core.Components[i].DataSheetUrl = append(core.Components[i].DataSheetUrl, newDataSheet)
				}
			}

			// LifecycleStatus
			for _, newLifecycle := range analyzedComponent.LifecycleStatus {
				found := false
				for j, existingLifecycle := range core.Components[i].LifecycleStatus {
					if existingLifecycle.Supplier == newLifecycle.Supplier {
						core.Components[i].LifecycleStatus[j] = newLifecycle
						found = true
						break
					}
				}
				if !found {
					core.Components[i].LifecycleStatus = append(core.Components[i].LifecycleStatus, newLifecycle)
				}
			}

			// ROHSStatus
			for _, newROHS := range analyzedComponent.ROHSStatus {
				found := false
				for j, existingROHS := range core.Components[i].ROHSStatus {
					if existingROHS.Supplier == newROHS.Supplier {
						core.Components[i].ROHSStatus[j] = newROHS
						found = true
						break
					}
				}
				if !found {
					core.Components[i].ROHSStatus = append(core.Components[i].ROHSStatus, newROHS)
				}
			}

			// SuggestedReplacement
			for _, newReplacement := range analyzedComponent.SuggestedReplacement {
				found := false
				for j, existingReplacement := range core.Components[i].SuggestedReplacement {
					if existingReplacement.Supplier == newReplacement.Supplier {
						core.Components[i].SuggestedReplacement[j] = newReplacement
						found = true
						break
					}
				}
				if !found {
					core.Components[i].SuggestedReplacement = append(core.Components[i].SuggestedReplacement, newReplacement)
				}
			}

			// PriceBreaks
			for _, newPriceBreak := range analyzedComponent.PriceBreaks {
				found := false
				for j, existingPriceBreak := range core.Components[i].PriceBreaks {
					if existingPriceBreak.Supplier == newPriceBreak.Supplier {
						core.Components[i].PriceBreaks[j] = newPriceBreak
						found = true
						break
					}
				}
				if !found {
					core.Components[i].PriceBreaks = append(core.Components[i].PriceBreaks, newPriceBreak)
				}
			}

			// SupplierDescription
			for _, newDescription := range analyzedComponent.SupplierDescription {
				found := false
				for j, existingDescription := range core.Components[i].SupplierDescription {
					if existingDescription.Supplier == newDescription.Supplier {
						core.Components[i].SupplierDescription[j] = newDescription
						found = true
						break
					}
				}
				if !found {
					core.Components[i].SupplierDescription = append(core.Components[i].SupplierDescription, newDescription)
				}
			}

			// SupplierManufacturer
			for _, newManufacturer := range analyzedComponent.SupplierManufacturer {
				found := false
				for j, existingManufacturer := range core.Components[i].SupplierManufacturer {
					if existingManufacturer.Supplier == newManufacturer.Supplier {
						core.Components[i].SupplierManufacturer[j] = newManufacturer
						found = true
						break
					}
				}
				if !found {
					core.Components[i].SupplierManufacturer = append(core.Components[i].SupplierManufacturer, newManufacturer)
				}
			}

			// Category
			for _, newCategory := range analyzedComponent.Category {
				found := false
				for j, existingCategory := range core.Components[i].Category {
					if existingCategory.Supplier == newCategory.Supplier {
						core.Components[i].Category[j] = newCategory
						found = true
						break
					}
				}
				if !found {
					core.Components[i].Category = append(core.Components[i].Category, newCategory)
				}
			}

			// ProductDetailUrl
			for _, newDetailUrl := range analyzedComponent.ProductDetailUrl {
				found := false
				for j, existingDetailUrl := range core.Components[i].ProductDetailUrl {
					if existingDetailUrl.Supplier == newDetailUrl.Supplier {
						core.Components[i].ProductDetailUrl[j] = newDetailUrl
						found = true
						break
					}
				}
				if !found {
					core.Components[i].ProductDetailUrl = append(core.Components[i].ProductDetailUrl, newDetailUrl)
				}
			}

			// InfoMessages
			core.Components[i].InfoMessages = append(core.Components[i].InfoMessages, analyzedComponent.InfoMessages...)
			
            // Sources
			for _, newSource := range analyzedComponent.Sources {
			    found := false
			    for _, existingSource := range core.Components[i].Sources {
			        if existingSource == newSource {
			            found = true
			            break
			        }
			    }
			    if !found {
			        core.Components[i].Sources = append(core.Components[i].Sources, newSource)
			    }
			}
			core.Components[i].Analyzed = true
			core.Components[i].LastRefresh = time.Now()   
			productionQuantity, _ := strconv.Atoi(config.PRODUCTION_QUANTITY)
			multisourcePriceCalculator(core.Components[i], productionQuantity, &currency, i)
        }
    }
}
