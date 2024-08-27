package gui

import (
	"bytes"
	"components"
	"config"
	"core"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

func UserApiKey() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.UserApiKey()", true).Stop()
	}
	// Create a new window.
	win := createWindow("User API Key", 300, 100)
	win.Connect("destroy", func() {
		win.Destroy()
	})
	// Create a vertical box.
	box := createBox(gtk.ORIENTATION_VERTICAL, 5)
	addBoxMargin(box)
	win.Add(box)
	// Create and add a label.
	label := createLabel("Enter your personal Mouser's API key: ")
	box.PackStart(label, false, false, 0)
	// Create and add an entry.
	entry := createEntry()
	box.PackStart(entry, false, false, 0)
	// Create and add a button.
	button := createButton("Test the API Key...")
	box.PackStart(button, false, false, 0)
	// Test the API key.
	testAPIKey(win, button, entry)
	win.ShowAll()
}

func testAPIKey(win *gtk.Window, button *gtk.Button, entry *gtk.Entry) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.testAPIKey()", false).Stop()
	}
	button.Connect("clicked", func() {
		unmarshalValidity := true
		apiKey, err := entry.GetText()
		if err != nil {
			log.Println(err)
			return
		}
		config.USER_API_KEY = apiKey
		// Create the request payload
		payload := components.RequestPayload{
			SearchByPartRequest: components.SearchByPartRequest{
				MouserPartNumber:  "test",
				PartSearchOptions: "1", // 1: several matching results 2: Exact result.
			},
		}
		// Encode the payload to JSON
		jsonData, err := json.Marshal(payload)
		if err != nil {
			unmarshalValidity = false
		}
		// Construct the full URL with the API key
		fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, config.USER_API_KEY)
		// Create a new HTTP POST request
		req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
		if err != nil {
			unmarshalValidity = false
		}
		// Add headers
		req.Header.Add("Content-Type", "application/json")
		req.Header.Add("Accept", "application/json")
		// Create an HTTP client and make the request
		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			unmarshalValidity = false
		}
		defer response.Body.Close()
		// Read the response body
		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			unmarshalValidity = false
		}
		// Unmarshal the JSON data into the ApiResponse struct
		var apiResponse components.ApiResponse
		err = json.Unmarshal(body, &apiResponse)
		if err != nil {
			unmarshalValidity = false
		}
		if len(apiResponse.Errors) == 0 && unmarshalValidity {
			showMessageDialog(win, "Valid API Key", "Your API key is valid...")
			win.Close()
			core.AnalysisState.KeyIsValid = true
			// Trigger the analyze button click
			glib.IdleAdd(func() {
				if TriggerAnalyze != nil {
					TriggerAnalyze()
				}
			})
		} else {
			showMessageDialog(win, "Wrong API Key", "Your API key is wrong...")
		}
	})
}
