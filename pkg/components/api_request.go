/*
* Package: components
* File: api_request.go
*
* Description:
* This file contains a function for making API requests to the Mouser Electronics
* API to retrieve component information. It processes each component in the
* core.Components slice, sends a request to the API, and updates the component
* with the received information.
*
* Main Function:
* - APIRequest: Sends a request to the Mouser API for a specific component and
*   processes the response.
*
* Input:
* - i (int): Index of the component in the core.Components slice to be processed.
*
* Output:
* - error: Returns an error if the API connection is lost or if there are any
*   issues during the request process.
*
* Note:
* This function assumes that the core.Components slice has been populated with
* component information, including MPNs. It uses the Mouser Electronics API to
* fetch additional details for each component. The function handles JSON
* encoding/decoding, HTTP requests, and updates the component information
* based on the API response.
 */

package components

import (
	"bytes"
	"config"
	"core"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"workspaces"
)

// APIRequest retrieves information based on the MPN
// and updates the corresponding component
func APIRequest(i int) error {
	// Check if a MPN was found.
	if core.Components[i].Mpn == "" {
		core.Components[i].Mpn = "MPN not found."
		return nil
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
		return errors.New("API connexion lost")
	}
	// Add some infos to the component.
	processAnalysis(apiResponse, Response{}, i, "Mouser")
	return nil
}
