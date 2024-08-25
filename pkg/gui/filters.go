package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

func filters() *gtk.Box {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.filters()", true).Stop()
	}
	// Create a new hBox for the checkboxes.
	checkboxesHBox := createBox(gtk.ORIENTATION_HORIZONTAL, 10)
	checkboxesHBox.PackStart(createBox(gtk.ORIENTATION_HORIZONTAL, 0), true, true, 0)
	// Generate each checkbox.
	checkboxes := createCheckBoxes("EQUAL", "DELETE", "INSERT", "UPDATE", "SWAP")
	for _, cb := range checkboxes {
		checkboxesHBox.PackStart(cb, false, false, 0)
	}
	// Create the export button
	exportButton := createButton("Export")
	exportButton.Connect("clicked", func() { ExportOptions() })
	checkboxesHBox.PackStart(exportButton, false, false, 0)
	// Create the analyze button and the progress bar.
	analyzeButtonBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	btnAnalyze(analyzeButtonBox)
	checkboxesHBox.PackStart(analyzeButtonBox, false, false, 0)
	// Create the header spin button.
	headerLabel := createLabel("Header:")
	checkboxesHBox.PackStart(headerLabel, false, false, 0)
	spinButton := createSpinButton()
	checkboxesHBox.PackStart(spinButton, false, false, 0)
	checkboxesHBox.PackStart(createBox(gtk.ORIENTATION_HORIZONTAL, 0), true, true, 0)
	return checkboxesHBox
}
