package gui

import (
	"export"
	"log"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the export window
func ExportOptions() {
	// Create a new window for exporting
	exportWindow, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	exportWindow.SetTitle("Export")
	exportWindow.SetDefaultSize(300, 100)

	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	exportWindow.Add(vbox)

	// Create an entry field for the filename
	entry, err := gtk.EntryNew()
	if err != nil {
		log.Fatal(err)
	}
	entry.SetPlaceholderText("Enter filename")
	vbox.PackStart(entry, false, false, 0)

	// Create the "OK" button
	okButton, err := gtk.ButtonNewWithLabel("OK")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(okButton, false, false, 0)

	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		fileName, err := entry.GetText()
		if err != nil {
			log.Fatal(err)
		}
		export.Export(fileName) // Call the export function with the filename
		exportWindow.Destroy()  // Close the window after exporting
	})

	exportWindow.ShowAll() // Show all elements in the window
}
