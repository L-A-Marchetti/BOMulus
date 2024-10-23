package components

import (
	"bytes"
	"config"
	"core"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"workspaces"
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
	core.ErrorsHandler(err)
	// Construct the full URL with the API key
	fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, workspaces.API_KEYS.MouserApiKey)
	// Create a new HTTP POST request
	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	core.ErrorsHandler(err)
	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	// Create an HTTP client and make the request
	client := &http.Client{}
	response, err := client.Do(req)
	core.ErrorsHandler(err)
	defer response.Body.Close()
	// Read the response body
	body, err := ioutil.ReadAll(response.Body)
	core.ErrorsHandler(err)
	// Unmarshal the JSON data into the ApiResponse struct
	var apiResponse ApiResponse
	err = json.Unmarshal(body, &apiResponse)
	core.ErrorsHandler(err)
	if apiResponse.SearchResults.NumberOfResult == 0 {
		return
	}
	// Add some infos to the component.
	appendAnalysis(apiResponse, i)
}
