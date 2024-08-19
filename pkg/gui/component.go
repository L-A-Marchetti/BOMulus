package gui

import (
	"components"
	"core"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
	"github.com/skratchdot/open-golang/open"
)

// Function to open the export window
func ShowComponent(i int, isOld bool) {
	// Find the specifig component.
	idx := components.FindComponentRowId(i, isOld)
	fmt.Println(idx)
	// Request the API (for now to avoid several calls during prototyping)
	//components.APIRequest(idx)
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
	vbox.SetMarginBottom(20)
	vbox.SetMarginTop(20)
	vbox.SetMarginStart(20)
	vbox.SetMarginEnd(20)
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
	availability := core.Components[idx].Availability
	if availability == "" {
		availability = "Out of stock"
	}
	availabilityLabel, err := gtk.LabelNew(availability)
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(availabilityLabel, false, false, 0)
	status := core.Components[idx].LifecycleStatus
	if status == "" {
		status = "Active"
	}
	lifecycleStatusLabel, err := gtk.LabelNew("Lifecycle Status: " + status)
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(lifecycleStatusLabel, false, false, 0)
	rohsLabel, err := gtk.LabelNew(core.Components[idx].ROHSStatus)
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(rohsLabel, false, false, 0)
	suggestion := core.Components[idx].SuggestedReplacement
	if suggestion != "" {
		replacementLabel, err := gtk.LabelNew("Suggested Replacement: " + suggestion)
		if err != nil {
			log.Fatal(err)
		}
		vbox.PackStart(replacementLabel, false, false, 0)
	}
	// Create a grid for price breaks.
	grid, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	grid.SetColumnSpacing(10)
	grid.SetRowSpacing(5)
	// Grid headers.
	quantityHeader, _ := gtk.LabelNew("Quantity")
	priceHeader, _ := gtk.LabelNew("Price")
	grid.Attach(quantityHeader, 0, 0, 1, 1)
	grid.Attach(priceHeader, 1, 0, 1, 1)
	// Append price breaks to the grid.
	for i, pb := range core.Components[idx].PriceBreaks {
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", pb.Quantity))
		priceLabel, _ := gtk.LabelNew(pb.Price)
		grid.Attach(quantityLabel, 0, i+1, 1, 1)
		grid.Attach(priceLabel, 1, i+1, 1, 1)
	}
	centerBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	centerBox.PackStart(grid, true, false, 0)
	vbox.PackStart(centerBox, false, false, 0)
	// Create the Data sheet button.
	dataSheetButton, err := gtk.ButtonNewWithLabel("Open Data Sheet")
	if err != nil {
		log.Print(err)
	} else {
		dataSheetButton.Connect("clicked", func() {
			err := open.Run(core.Components[idx].DataSheetUrl)
			if err != nil {
				log.Print(err)
			}
		})
		vbox.PackStart(dataSheetButton, false, false, 0)
	}
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
