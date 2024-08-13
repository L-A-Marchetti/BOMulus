package gui

import (
	"components"
	"config"
	"context"
	"core"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"golang.org/x/time/rate"
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
	// Create the analyze button and the progress bar.
	analyzeButton, err := gtk.ButtonNewWithLabel("Analyze")
	if err != nil {
		log.Fatal(err)
	}
	analyzeButtonBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	analyzeButtonBox.PackStart(analyzeButton, false, false, 0)
	checkboxesHBox.PackStart(analyzeButtonBox, false, false, 0)

	analyzeButton.Connect("clicked", func() {
		progressBar, err := gtk.ProgressBarNew()
		if err != nil {
			log.Fatal(err)
		}
		progressBar.SetShowText(true)
		progressBar.SetText("0 / 0")
		progressBar.SetSizeRequest(20, -1) // Set width to 100 pixels, keep default height

		analyzeButtonBox.Remove(analyzeButton)
		analyzeButtonBox.Add(progressBar)
		analyzeButtonBox.ShowAll()
		go runAnalysis(progressBar, analyzeButton, analyzeButtonBox)
	})
	// Create the header label.
	headerLabel, err := gtk.LabelNew("Header:")
	if err != nil {
		panic(err)
	}
	// Add the headerLabel to the hBox
	checkboxesHBox.PackStart(headerLabel, false, false, 0)
	// Create a new SpinButton
	spinButton, err := gtk.SpinButtonNewWithRange(0, float64(len(core.XlsmDeltas)), 1)
	if err != nil {
		log.Fatal(err)
	}
	// If needed we can orientate spinbuttons vertically.
	// spinButton.SetOrientation(gtk.ORIENTATION_VERTICAL)
	// Set default value
	spinButton.SetValue(float64(core.Filters.Header))

	// Connect the "value-changed" signal
	spinButton.Connect("value-changed", func() {
		value := spinButton.GetValue()
		core.Filters.Header = int(value)
		// Generate delta data.
		core.XlsmDiff()
		UpdateView()
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

func runAnalysis(progressBar *gtk.ProgressBar, analyzeButton *gtk.Button, container *gtk.Box) {
	totalComponents := len(core.Components)
	// Create a rate limiter to avoid too much calls per minutes (30/minutes for mouser)
	limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
	for i := 0; i < totalComponents; i++ {
		err := limiter.Wait(context.Background())
		if err != nil {
			log.Print(err)
			continue
		}
		fmt.Println(core.Components[i].NewRow)
		components.APIRequest(i)
		glib.IdleAdd(func() {
			fraction := float64(i+1) / float64(totalComponents)
			progressBar.SetFraction(fraction)
			progressBar.SetText(fmt.Sprintf("%d / %d", i+1, totalComponents))
		})
		updateTableRow() // It may be more safe in the IdleAdd ?
	}
	glib.IdleAdd(func() {
		container.Remove(progressBar)
		analyzeButton.SetLabel("✓")
		container.Add(analyzeButton)
		container.ShowAll()
	})
}

func updateTableRow() {
	iter, ok := resultStore.GetIterFirst()
	if !ok {
		return
	}

	for {
		value, err := resultStore.GetValue(iter, 2) // Column for NewRow
		if err != nil {
			log.Printf("Error getting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		newRow, err := value.GoValue()
		if err != nil {
			log.Printf("Error converting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		// Check if the value is an empty string
		strNewRow, ok := newRow.(string)
		if !ok || strNewRow == "" {
			// Move to the next row if the value is empty or not a string
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		intNewRow, err := strconv.Atoi(strNewRow)
		if err != nil {
			log.Printf("Error converting to int: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		compIdx := components.FindComponentRowId(intNewRow)
		if compIdx >= 0 && compIdx < len(core.Components) && core.Components[compIdx].Analyzed {
			err = resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
			if err != nil {
				log.Printf("Error setting value: %v", err)
			}
		}

		if !resultStore.IterNext(iter) {
			break
		}
	}

	// Force the user interface to refresh
	glib.IdleAdd(func() {
		if treeView, err := gtk.TreeViewNew(); err == nil {
			treeView.QueueDraw()
		}
	})
}
