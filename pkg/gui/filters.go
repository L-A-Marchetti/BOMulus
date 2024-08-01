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
	labels := []string{"EQUAL", "DELETE", "INSERT", "UPDATE"}

	for i, label := range labels {
		cb, err := gtk.CheckButtonNewWithLabel(label)
		if err != nil {
			log.Fatal(err)
		}
		switch i {
		case 0:
			if core.Filters.Equal {
				cb.SetActive(true)
			} else {
				cb.SetActive(false)
			}
		case 1:
			if core.Filters.Delete {
				cb.SetActive(true)
			} else {
				cb.SetActive(false)
			}
		case 2:
			if core.Filters.Insert {
				cb.SetActive(true)
			} else {
				cb.SetActive(false)
			}
		case 3:
			if core.Filters.Update {
				cb.SetActive(true)
			} else {
				cb.SetActive(false)
			}
		}
		checkboxes = append(checkboxes, cb)
	}
	// Add a flexible space at the beginning
	spacerStart, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	checkboxesHBox.PackStart(spacerStart, true, true, 0)
	// Add checkboxes
	for _, cb := range checkboxes {
		checkboxesHBox.PackStart(cb, false, false, 0)
	}
	// Add a flexible space at the end
	spacerEnd, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	checkboxesHBox.PackStart(spacerEnd, true, true, 0)
	// Connect all checkboxes
	for _, cb := range checkboxes {
		cb.Connect("toggled", func() {
			SetFilters(checkboxes)
			UpdateView()
		})
	}
	SetFilters(checkboxes)
	return checkboxesHBox
}

func SetFilters(checkboxes []*gtk.CheckButton) {
	for _, cb := range checkboxes {
		label, _ := cb.GetLabel()
		switch label {
		case "EQUAL":
			if cb.GetActive() {
				core.Filters.Equal = true
			} else {
				core.Filters.Equal = false
			}
		case "DELETE":
			if cb.GetActive() {
				core.Filters.Delete = true
			} else {
				core.Filters.Delete = false
			}
		case "INSERT":
			if cb.GetActive() {
				core.Filters.Insert = true
			} else {
				core.Filters.Insert = false
			}
		case "UPDATE":
			if cb.GetActive() {
				core.Filters.Update = true
			} else {
				core.Filters.Update = false
			}
		}
	}
}
