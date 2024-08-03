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
	exportWindow.SetDefaultSize(300, 150)
	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	exportWindow.Add(vbox)
	// Create a label for the directory path
	dirLabel, err := gtk.LabelNew("")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(dirLabel, false, false, 0)
	// Create a button to choose the directory
	dirButton, err := gtk.ButtonNewWithLabel("Choose Directory")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(dirButton, false, false, 0)
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
	// Variable to store the selected directory
	var selectedPath string
	// Connect the directory button to open a file chooser dialog
	dirButton.Connect("clicked", func() {
		dialog, err := gtk.FileChooserDialogNewWith2Buttons("Select Directory",
			exportWindow,
			gtk.FILE_CHOOSER_ACTION_SELECT_FOLDER,
			"Cancel", gtk.RESPONSE_CANCEL,
			"Select", gtk.RESPONSE_ACCEPT)
		if err != nil {
			log.Fatal(err)
		}
		defer dialog.Destroy()
		if dialog.Run() == gtk.RESPONSE_ACCEPT {
			dir := dialog.GetFilename()
			dirLabel.SetText(dir) // Set the selected directory in the label
			selectedPath = dir    // Store the selected directory
		}
	})
	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		fileName, err := entry.GetText()
		if err != nil {
			log.Fatal(err)
		}
		// Check if the selected path or filename is empty
		if selectedPath == "" {
			showMessageDialog(exportWindow, "Error", "Please select a destination.")
			return
		}
		if fileName == "" {
			showMessageDialog(exportWindow, "Error", "Please enter a file name.")
			return
		}
		// Call the export function with the full path
		export.Export(selectedPath+"/", fileName)
		// Notify the user of successful export
		showMessageDialog(exportWindow, "Success", "File exported")
		exportWindow.Destroy() // Close the window after exporting
	})
	exportWindow.ShowAll() // Show all elements in the window
}

// Function to show a message dialog
func showMessageDialog(parent *gtk.Window, title string, message string) {
	msgDialog := gtk.MessageDialogNew(parent,
		gtk.DIALOG_MODAL,
		gtk.MESSAGE_INFO,
		gtk.BUTTONS_OK,
		message)
	msgDialog.SetTitle(title)
	msgDialog.Run()     // Show the dialog
	msgDialog.Destroy() // Destroy the dialog after use
}
