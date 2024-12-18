/*
* Package: components
* File: api_keys_testing.go
*
* Description:
* This file contains a function for testing the validity of an API key for
* different suppliers, currently supporting Mouser Electronics. It sends a test
* request to the API and validates the response to ensure the API key is correct.
*
* Main Function:
* - TestAPIKey: Tests the provided API key by sending a request to the supplier's
*   API and validating the response.
*
* Input:
* - apiKey (string): The API key to be tested.
* - supplier (string): The name of the supplier (currently only "mouser" is supported).
*
* Output:
* - error: Returns nil if the API key is valid, or an error describing the issue
*   if the key is invalid or if there are any problems during the testing process.
*
* Note:
* This function assumes that the necessary configurations (like API URLs) are
* set up in the config package. It updates the API key in the workspaces package
* if the key is valid.
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
	"log"
	"net/http"
	"workspaces"
)

// TestAPIKey sends a test request to the API and
// validates the response to ensure the API key is correct.
func TestAPIKey(apiKey, clientID, clientSecret string, supplier string) error {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.testAPIKey()", false).Stop()
	}
	switch supplier {
	case "mouser":
		// Create the request payload
		payload := RequestPayload{
			SearchByPartRequest: SearchByPartRequest{
				MouserPartNumber:  "test",
				PartSearchOptions: "1",
			},
		}
		// Encode the payload to JSON
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return errors.New("Failed to create JSON payload.")
		}
		// Construct the full URL with the API key
		fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, apiKey)
		// Create a new HTTP POST request
		req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
		if err != nil {
			return errors.New("Failed to create HTTP request.")
		}
		// Add headers
		req.Header.Add("Content-Type", "application/json")
		req.Header.Add("Accept", "application/json")
		// Create an HTTP client and make the request
		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			return errors.New("Failed to send HTTP request.")
		}
		defer response.Body.Close()
		// Read the response body
		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			return errors.New("Failed to read HTTP response.")
		}
		// Unmarshal the JSON data into the ApiResponse struct
		var apiResponse ApiResponse
		err = json.Unmarshal(body, &apiResponse)
		if err != nil {
			return errors.New("Failed to parse API response.")
		}
		// If there are no errors, then the API key is considered valid.
		if len(apiResponse.Errors) == 0 {
			workspaces.API_KEYS.MouserApiKey = apiKey
			workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{
				MouserApiKey: apiKey,
			}, false, false, -1, nil)
		} else {
			return errors.New("Your API key is wrong...")
		}
	case "dk":
		// Create the request payload
		payload := map[string]interface{}{
			"Keywords": "test",
			"Limit":    1, // Limit to 1 result.
			"Offset":   0,
		}
		// Encode the payload to JSON
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return errors.New("Failed to create JSON payload.")
		}
		// Create a new HTTP POST request
		req, err := http.NewRequest("POST", config.DIGIKEY_API_URL, bytes.NewBuffer(jsonData))
		if err != nil {
			return errors.New("Failed to create HTTP request.")
		}
		// Add headers
		req.Header.Add("Content-Type", "application/json")
		OAuthToken, err := getOAuthToken(clientSecret) // Get an access token from the authorization server's token endpoint
		if err != nil {
			return errors.New("Wrong Client Secret.")
		}
		req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", OAuthToken))
		req.Header.Add("X-DIGIKEY-Client-Id", clientID)
		req.Header.Add("X-DIGIKEY-Locale-Language", "en")
		req.Header.Add("X-DIGIKEY-Locale-Currency", "USD")
		req.Header.Add("X-DIGIKEY-Locale-Site", "US")
		// Create an HTTP client and make the request
		client := &http.Client{}
		response, err := client.Do(req)
		log.Println(clientID, clientSecret)
		if err != nil {
			log.Println(err)
			return errors.New("Failed to send HTTP request.")
		}
		defer response.Body.Close()
		// Read the response body
		//body, err := ioutil.ReadAll(response.Body)
		//core.ErrorsHandler(err)
		// Check HTTP Status.
		if response.StatusCode != http.StatusOK {
			return errors.New("Your API key is wrong...")
		} else {
			workspaces.API_KEYS.DKClientId = clientID
			workspaces.API_KEYS.DKSecret = clientSecret
			workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{
				DKClientId: clientID,
				DKSecret:   clientSecret,
			}, false, false, -1, nil)
		}
	}
	return nil
}
