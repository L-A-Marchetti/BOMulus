package gui

import (
	"core"
	"log"

	"github.com/gotk3/gotk3/gtk"
)

func CheckBoxes() *gtk.Box {
	// Create a new hBox for the checkboxes.
	checkboxesHBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 10) // Add some spacing between checkboxes
	if err != nil {
		panic(err)
	}

	// Generate each checkbox
	checkboxes := []*gtk.CheckButton{}
	labels := []string{"EQUAL", "DELETE", "INSERT", "UPDATE", "SWAP"}

	for i, label := range labels {
		cb, err := gtk.CheckButtonNewWithLabel(label)
		if err != nil {
			log.Fatal(err)
		}
		// Initialize checkboxes.
		cb = core.InitFilters(i, cb)
		checkboxes = append(checkboxes, cb)
	}

	// Add a flexible space at the beginning
	spacerStart, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	checkboxesHBox.PackStart(spacerStart, true, true, 0)

	// Add checkboxes
	for _, cb := range checkboxes {
		checkboxesHBox.PackStart(cb, false, false, 0)
	}

	// Create the export button
	exportButton, err := gtk.ButtonNewWithLabel("Export")
	if err != nil {
		log.Fatal(err)
	}

	// Connect the button to the export function
	exportButton.Connect("clicked", func() {
		ExportOptions()
	})

	// Add the button to the hBox
	checkboxesHBox.PackStart(exportButton, false, false, 0)
	// Create a new SpinButton
	spinButton, err := gtk.SpinButtonNewWithRange(0, float64(len(core.XlsmDeltas)), 1)
	if err != nil {
		log.Fatal(err)
	}

	// Set default value
	spinButton.SetValue(0)

	// Connect the "value-changed" signal
	spinButton.Connect("value-changed", func() {
		value := spinButton.GetValue()
		log.Printf("SpinButton value changed to: %.2f", value)
	})
	// Add the spinButton to the hBox
	checkboxesHBox.PackStart(spinButton, false, false, 0)
	// Add a flexible space at the end
	spacerEnd, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	checkboxesHBox.PackStart(spacerEnd, true, true, 0)

	// Connect all checkboxes
	for _, cb := range checkboxes {
		cb.Connect("toggled", func() {
			// If a checkbox is toggled change the filters.
			core.SetFilters(checkboxes)
			UpdateView()
		})
	}

	return checkboxesHBox
}
