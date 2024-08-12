package gui

import (
	"components"
	"core"
	"io"
	"log"
	"net/http"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

// Function to open the export window
func ShowComponent(i int) {
	// Find the specifig component.
	idx := components.FindComponentRowId(i)
	// Request the API (for now to avoid several calls during prototyping)
	components.APIRequest(idx)
	// Create a new window for showing a component.
	componentWindow, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	componentWindow.SetTitle(core.Components[idx].Mpn)
	componentWindow.SetDefaultSize(300, 200)
	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	componentWindow.Add(vbox)
	// Create an img.
	image, _ := gtk.ImageNew()
	// Request with a user-agent.
	req, err := http.NewRequest("GET", core.Components[idx].ImagePath, nil)
	if err == nil {
		req.Header.Set("User-Agent", "BOMulus")
		// Http client to execute the req.
		client := &http.Client{}
		resp, err := client.Do(req)
		if err == nil {
			defer resp.Body.Close()
			loader, _ := gdk.PixbufLoaderNew()
			defer loader.Close()
			_, err = io.Copy(loader, resp.Body)
			if err == nil {
				loader.Close()
				pixbuf, _ := loader.GetPixbuf()
				image.SetFromPixbuf(pixbuf)
			}
		}
	}
	vbox.PackStart(image, false, false, 0)
	// Create labels for basic infos.
	availabilityLabel, err := gtk.LabelNew(core.Components[idx].Availability)
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(availabilityLabel, false, false, 0)
	// Create the "OK" button
	okButton, err := gtk.ButtonNewWithLabel("OK")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(okButton, false, false, 0)
	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		componentWindow.Destroy() // Close the window after exporting
	})
	componentWindow.ShowAll() // Show all elements in the window
}
