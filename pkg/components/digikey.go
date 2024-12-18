package components

import (
	"bytes"
	"config"
	"core"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"workspaces"
)

// APIRequestToDigiKey retrieves information based on the ManufacturerPartNumber (MPN)
// and updates the corresponding component
func APIRequestToDigiKey(i int) error {
	// Check if a MPN was found.
	if core.Components[i].Mpn == "" {
		core.Components[i].Mpn = "MPN not found."
		return nil
	}
	// Create the request payload
	payload := map[string]interface{}{
		"Keywords": core.Components[i].Mpn,
		"Limit":    1, // Limit to 1 result.
		"Offset":   0,
	}
	// Encode the payload to JSON
	jsonData, err := json.Marshal(payload)
	core.ErrorsHandler(err)
	// Create a new HTTP POST request
	req, err := http.NewRequest("POST", config.DIGIKEY_API_URL, bytes.NewBuffer(jsonData))
	core.ErrorsHandler(err)
	// Add headers
	req.Header.Add("Content-Type", "application/json")
	OAuthToken, _ := getOAuthToken(workspaces.API_KEYS.DKSecret) // Get an access token from the authorization server's token endpoint
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", OAuthToken))
	req.Header.Add("X-DIGIKEY-Client-Id", workspaces.API_KEYS.DKClientId)
	req.Header.Add("X-DIGIKEY-Locale-Language", "en")
	req.Header.Add("X-DIGIKEY-Locale-Currency", "USD")
	req.Header.Add("X-DIGIKEY-Locale-Site", "US")
	// Create an HTTP client and make the request
	client := &http.Client{}
	response, err := client.Do(req)
	core.ErrorsHandler(err)
	defer response.Body.Close()
	// Read the response body
	body, err := ioutil.ReadAll(response.Body)
	core.ErrorsHandler(err)
	// Check HTTP Status.
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("Digi-Key API error: %s", response.Status)
	}
	// Unmarshal the JSON data into the ApiResponse struct
	var apiResponse Response
	err = json.Unmarshal(body, &apiResponse)
	core.ErrorsHandler(err)
	return nil
}

func getOAuthToken(clientSecret string) (string, error) {
	// Prepare data for request.
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	// Create POST request
	req, err := http.NewRequest("POST", config.DK_ENDPOINT, bytes.NewBufferString(data.Encode()))
	core.ErrorsHandler(err)
	// Add HTTP headers
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(workspaces.API_KEYS.DKClientId, clientSecret)
	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	core.ErrorsHandler(err)
	defer resp.Body.Close()
	// Read the body response
	body, err := ioutil.ReadAll(resp.Body)
	core.ErrorsHandler(err)
	// Check HTTP status code.
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Error while getting the access token : %s", body)
	}
	// Décoder le JSON de la réponse
	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	core.ErrorsHandler(err)
	// Parse token in the response.
	accessToken, ok := result["access_token"].(string)
	if !ok {
		return "", fmt.Errorf("token not found")
	}
	return accessToken, nil
}
