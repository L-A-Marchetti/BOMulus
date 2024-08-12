package gui

import (
	"components"
	"log"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the export window
func ShowComponent(i int) {
	// Find the specifig component.
	component := components.FindComponentRowId(i)
	// Create a new window for showing a component.
	componentWindow, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	componentWindow.SetTitle(component.Mpn)
	componentWindow.SetDefaultSize(300, 200)
	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	componentWindow.Add(vbox)
	// Create a label for checkboxes
	displayLabel, err := gtk.LabelNew("Display:")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(displayLabel, false, false, 0)
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
