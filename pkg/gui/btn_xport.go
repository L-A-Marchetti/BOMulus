package gui

import (
	"config"
	"core"
	"export"

	"github.com/gotk3/gotk3/gtk"
)

var selectedPath string

func fileChooser(dirButton *gtk.Button, exportWindow *gtk.Window, dirLabel *gtk.Label) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.fileChooser()", false).Stop()
	}
	dirButton.Connect("clicked", func() {
		dialog, err := gtk.FileChooserDialogNewWith2Buttons("Select Directory",
			exportWindow,
			gtk.FILE_CHOOSER_ACTION_SELECT_FOLDER,
			"Cancel", gtk.RESPONSE_CANCEL,
			"Select", gtk.RESPONSE_ACCEPT)
		core.ErrorsHandler(err)
		defer dialog.Destroy()
		if dialog.Run() == gtk.RESPONSE_ACCEPT {
			dir := dialog.GetFilename()
			dirLabel.SetText(dir) // Set the selected directory in the label
			selectedPath = dir    // Store the selected directory
		}
	})
}

func btnExport(okButton *gtk.Button, entry *gtk.Entry, exportWindow *gtk.Window, checkboxes []*gtk.CheckButton) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.btnExport()", false).Stop()
	}
	okButton.Connect("clicked", func() {
		fileName, err := entry.GetText()
		core.ErrorsHandler(err)
		// Check if the selected path or filename is empty
		if selectedPath == "" {
			showMessageDialog(exportWindow, "Error", "Please select a destination.")
			return
		}
		if fileName == "" {
			showMessageDialog(exportWindow, "Error", "Please enter a file name.")
			return
		}
		// Get the states of the checkboxes
		deleteChecked, insertChecked, updateChecked := checkboxes[0].GetActive(), checkboxes[1].GetActive(), checkboxes[2].GetActive()
		// Call the export function with the full path and checkbox states
		export.Export(selectedPath+"/", fileName, deleteChecked, insertChecked, updateChecked)
		// Notify the user of successful export
		showMessageDialog(exportWindow, "Success", "File exported")
		exportWindow.Destroy() // Close the window after exporting
	})
}
