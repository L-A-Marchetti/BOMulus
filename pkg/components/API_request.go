package components

import (
	"bytes"
	"config"
	"core"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func APIRequest(i int) {
	// Check if a MPN was found.
	if core.Components[i].Mpn == "" {
		core.Components[i].Mpn = "MPN not found."
		return
	}
	// Create the request payload
	payload := RequestPayload{
		SearchByPartRequest: SearchByPartRequest{
			MouserPartNumber:  core.Components[i].Mpn,
			PartSearchOptions: "1", // 1: several matching results 2: Exact result.
		},
	}
	// Encode the payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Fatalf("Failed to marshal JSON: %v", err)
	}
	// Construct the full URL with the API key
	fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, config.USER_API_KEY)
	// Create a new HTTP POST request
	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatalf("Failed to create request: %v", err)
	}
	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	// Create an HTTP client and make the request
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		log.Fatalf("Failed to make request: %v", err)
	}
	defer response.Body.Close()
	// Read the response body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %v", err)
	}
	// Unmarshal the JSON data into the ApiResponse struct
	var apiResponse ApiResponse
	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		log.Fatalf("Failed to unmarshal JSON: %v", err)
	}
	if apiResponse.SearchResults.NumberOfResult == 0 {
		return
	}
	// Add some infos to the component.
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
	} else {
		for _, part := range apiResponse.SearchResults.Parts {
			alternativeMpn := core.Component{}
			alternativeMpn.Mpn = part.ManufacturerPartNumber
			alternativeMpn.SupplierDescription = part.Description
			core.Components[i].MismatchMpn = append(core.Components[i].MismatchMpn, alternativeMpn)
		}
	}

	// Validate the analysis
	if len(apiResponse.Errors) == 0 {
		core.Components[i].Analyzed = true
	}
}
