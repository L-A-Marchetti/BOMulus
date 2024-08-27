package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the export window
func ExportOptions() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.ExportOptions()", true).Stop()
	}
	// Create a new window for exporting
	exportWindow := createWindow("Export", 300, 200)
	// Create a vertical box container for the window
	vbox := createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	exportWindow.Add(vbox)
	// Create a label for the directory path
	dirLabel := createLabel("")
	vbox.PackStart(dirLabel, false, false, 0)
	// Create a button to choose the directory
	dirButton := createButton("Choose Directory")
	vbox.PackStart(dirButton, false, false, 0)
	// Create an entry field for the filename
	entry := createEntry()
	entry.SetPlaceholderText("Enter filename")
	vbox.PackStart(entry, false, false, 0)
	// Create a label for checkboxes
	displayLabel := createLabel("Display:")
	vbox.PackStart(displayLabel, false, false, 0)
	// Create a horizontal box for checkboxes
	hbox := createBox(gtk.ORIENTATION_HORIZONTAL, 10)
	hbox.SetHAlign(gtk.ALIGN_CENTER) // Center the hbox horizontally
	vbox.PackStart(hbox, false, false, 0)
	// Create checkboxes
	checkboxes := createCheckBoxes("DELETE", "INSERT", "UPDATE")
	for _, cb := range checkboxes {
		cb.SetActive(true)
		hbox.PackStart(cb, false, false, 0)
	}
	// Create the "OK" button
	okButton := createButton("OK")
	vbox.PackStart(okButton, false, false, 0)
	// Connect the directory button to open a file chooser dialog
	fileChooser(dirButton, exportWindow, dirLabel)
	// Connect the "OK" button to the export function
	btnExport(okButton, entry, exportWindow, checkboxes)
	exportWindow.ShowAll() // Show all elements in the window
}
