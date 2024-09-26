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

// Analysis settings window
func AnalysisRange(callback func()) {
	win := createWindow("Analysis settings", 300, 100)
	win.Connect("destroy", func() {
		win.Destroy()
	})

	box := createBox(gtk.ORIENTATION_VERTICAL, 5)
	addBoxMargin(box)
	win.Add(box)

	// Create combo boxes for Analysis range.
	createComboBoxes(box)

	button := createButton("Validate Range")
	box.PackStart(button, false, false, 0)

	button.Connect("clicked", func() {
		if core.AnalysisState.IdxEnd <= 0 {
			core.AnalysisState.IdxEnd = len(core.Components) - 1
		}
		if core.AnalysisState.IdxEnd-core.AnalysisState.IdxStart+1 <= 0 {
			showMessageDialog(win, "Invalid range", "Please select a valid range...")
			return
		}

		win.Close()

		// Appeler le callback
		if callback != nil {
			callback()
		}
	})

	win.ShowAll()
}

func UserApiKey(callback func()) {
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
	APIExists, APIKey := core.LoadAPIKey()
	if APIExists {
		entry.SetText(APIKey)
	}
	box.PackStart(entry, false, false, 0)
	// Create and add a button.
	button := createButton("OK")
	box.PackStart(button, false, false, 0)

	button.Connect("clicked", func() {
		testAPIKey(win, entry, callback)
	})

	win.ShowAll()
}

func testAPIKey(win *gtk.Window, entry *gtk.Entry, callback func()) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.testAPIKey()", false).Stop()
	}

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
			PartSearchOptions: "1",
		},
	}

	// Encode the payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		showMessageDialog(win, "Error", "Failed to create JSON payload.")
		return
	}

	// Construct the full URL with the API key
	fullURL := fmt.Sprintf("%s?apiKey=%s", config.API_URL, config.USER_API_KEY)

	// Create a new HTTP POST request
	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	if err != nil {
		showMessageDialog(win, "Error", "Failed to create HTTP request.")
		return
	}
	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	// Create an HTTP client and make the request
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		showMessageDialog(win, "Error", "Failed to send HTTP request.")
		return
	}
	defer response.Body.Close()
	// Read the response body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		showMessageDialog(win, "Error", "Failed to read HTTP response.")
		return
	}
	// Unmarshal the JSON data into the ApiResponse struct
	var apiResponse components.ApiResponse
	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		showMessageDialog(win, "Error", "Failed to parse API response.")
		return
	}
	if len(apiResponse.Errors) == 0 {
		win.Close()
		core.AnalysisState.KeyIsValid = true
		core.SaveAPIKey()

		// Appeler le callback
		if callback != nil {
			callback()
		}
	} else {
		showMessageDialog(win, "Wrong API Key", "Your API key is wrong...")
	}
}
