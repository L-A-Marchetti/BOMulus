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
			PartSearchOptions: "2", // 1: several matching results 2: Exact result.
		},
	}
	// Encode the payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.Fatalf("Failed to marshal JSON: %v", err)
	}
	// Construct the full URL with the API key
	fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, config.API_KEY)
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
	// Add some infos to the component.
	core.Components[i].ImagePath = apiResponse.SearchResults.Parts[0].ImagePath
	core.Components[i].Availability = apiResponse.SearchResults.Parts[0].Availability
	core.Components[i].DataSheetUrl = apiResponse.SearchResults.Parts[0].DataSheetUrl
	/* Print the parsed data for prototyping purpose.
	if len(apiResponse.Errors) > 0 {
		fmt.Println("Errors:")
		for _, e := range apiResponse.Errors {
			fmt.Printf("Code: %s, Message: %s\n", e.Code, e.Message)
		}
	} else {
		fmt.Printf("Number of Results: %d\n", apiResponse.SearchResults.NumberOfResult)
		for _, part := range apiResponse.SearchResults.Parts {
			fmt.Printf("Part Number: %s, Description: %s\n", part.ManufacturerPartNumber, part.Description)
		}
	}*/
}
