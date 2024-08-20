package gui

import (
	"fmt"
	"log"
	"report"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the report window
func ShowReport() {
	// Prototyping Report functions.
	oosComponents := report.OutOfStockComp()
	// Create a new window for showing the report.
	reportWindow, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	reportWindow.SetTitle("Analysis Report")
	reportWindow.SetDefaultSize(300, 200)
	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	vbox.SetMarginBottom(20)
	vbox.SetMarginTop(20)
	vbox.SetMarginStart(20)
	vbox.SetMarginEnd(20)
	reportWindow.Add(vbox)
	// Create labels to categorize infos.
	infosLabel, err := gtk.LabelNew("---------- Infos Summary ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(infosLabel, false, false, 0)
	manufacturingLabel, err := gtk.LabelNew("---------- Ordering/Manufacturing ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(manufacturingLabel, false, false, 0)
	oosLabel, err := gtk.LabelNew("---------- Out of Stock components ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(oosLabel, false, false, 0)
	// Create a grid for Out of Stock components.
	oosGrid, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	oosGrid.SetColumnSpacing(10)
	oosGrid.SetRowSpacing(5)
	// oosGrid headers.
	quantityHeader, _ := gtk.LabelNew("Quantity")
	mpnHeader, _ := gtk.LabelNew("Manufacturer Part Number")
	oosGrid.Attach(quantityHeader, 0, 0, 1, 1)
	oosGrid.Attach(mpnHeader, 1, 0, 1, 1)
	// Append price breaks to the oosGrid.
	for i, oosComponent := range oosComponents {
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", oosComponent.Quantity))
		mpnLabel, _ := gtk.LabelNew(oosComponent.Mpn)
		oosGrid.Attach(quantityLabel, 0, i+1, 1, 1)
		oosGrid.Attach(mpnLabel, 1, i+1, 1, 1)
	}
	centerBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	centerBox.PackStart(oosGrid, true, false, 0)
	vbox.PackStart(centerBox, false, false, 0)
	suggestionsLabel, err := gtk.LabelNew("---------- Suggestions ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(suggestionsLabel, false, false, 0)
	// Create the "OK" button
	okButton, err := gtk.ButtonNewWithLabel("OK")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(okButton, false, false, 0)
	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		reportWindow.Destroy() // Close the window after exporting
	})
	reportWindow.ShowAll() // Show all elements in the window
}
