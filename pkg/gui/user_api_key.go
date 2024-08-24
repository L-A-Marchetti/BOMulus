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

	"github.com/gotk3/gotk3/gtk"
)

func UserApiKey() {
	// Create a new window
	win, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	win.SetTitle("User API Key")
	win.Connect("destroy", func() {
		win.Destroy()
	})
	// Create a vertical box
	box, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 5)
	if err != nil {
		log.Fatal(err)
	}
	box.SetMarginBottom(20)
	box.SetMarginTop(20)
	box.SetMarginStart(20)
	box.SetMarginEnd(20)
	win.Add(box)

	// Create and add a label
	label, err := gtk.LabelNew("Enter your personal Mouser's API key: ")
	if err != nil {
		log.Fatal(err)
	}
	box.PackStart(label, false, false, 0)

	// Create and add an entry
	entry, err := gtk.EntryNew()
	if err != nil {
		log.Fatal(err)
	}
	box.PackStart(entry, false, false, 0)

	// Create and add a button
	button, err := gtk.ButtonNewWithLabel("Test the API Key...")
	if err != nil {
		log.Fatal(err)
	}
	box.PackStart(button, false, false, 0)

	// Connect the button to a handler
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
		} else {
			showMessageDialog(win, "Wrong API Key", "Your API key is wrong...")
		}
	})

	// Set window size and show all widgets
	win.SetDefaultSize(300, 100)
	win.ShowAll()
}
