package gui

import (
	"components"
	"config"
	"context"
	"core"
	"log"
	"strconv"
	"time"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"golang.org/x/time/rate"
)

func CheckBoxes() *gtk.Box {
	if config.DEBUGGING {
		defer core.StartBenchmark("CheckBoxes()", true).Stop()
	}
	// Create a new hBox for the checkboxes.
	checkboxesHBox := createBox(gtk.ORIENTATION_HORIZONTAL, 10)
	// Generate each checkbox.
	checkboxes := createCheckBoxes("EQUAL", "DELETE", "INSERT", "UPDATE", "SWAP")
	// Add a flexible space at the beginning
	spacerStart := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	checkboxesHBox.PackStart(spacerStart, true, true, 0)
	// Add checkboxes
	for _, cb := range checkboxes {
		checkboxesHBox.PackStart(cb, false, false, 0)
	}
	// Create the export button
	exportButton := createButton("Export")
	// Connect the button to the export function
	exportButton.Connect("clicked", func() {
		ExportOptions()
	})
	// Add the button to the hBox
	checkboxesHBox.PackStart(exportButton, false, false, 0)
	// Create the analyze button and the progress bar.
	analyzeButtonBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	// Create the metamorph analyze button.
	btnAnalyze(analyzeButtonBox)
	checkboxesHBox.PackStart(analyzeButtonBox, false, false, 0)
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
	return checkboxesHBox
}

func runAnalysis() {
	totalComponents := len(core.Components)
	limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
	for i := 0; i < totalComponents; i++ {
		err := limiter.Wait(context.Background())
		if err != nil {
			log.Print(err)
			continue
		}
		components.APIRequest(i)

		glib.IdleAdd(func() {
			core.AnalysisState.Current = i + 1
			core.AnalysisState.Progress = float64(i+1) / float64(totalComponents)
			updateTableRow()
		})
	}

	glib.IdleAdd(func() {
		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
		UpdateView()
	})
}

func updateTableRow() {
	iter, ok := resultStore.GetIterFirst()
	if !ok {
		return
	}

	for {
		newRowValue, err := resultStore.GetValue(iter, 2) // Column for NewRow
		if err != nil {
			log.Printf("Error getting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		oldRowValue, err := resultStore.GetValue(iter, 1) // Column for NewRow
		if err != nil {
			log.Printf("Error getting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		newRow, err := newRowValue.GoValue()
		if err != nil {
			log.Printf("Error converting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		oldRow, err := oldRowValue.GoValue()
		if err != nil {
			log.Printf("Error converting value: %v", err)
			if !resultStore.IterNext(iter) {
				break
			}
			continue
		}

		// Check if the value is an empty string
		strNewRow, _ := newRow.(string)
		strOldRow, _ := oldRow.(string)

		if strNewRow != "" {
			intNewRow, err := strconv.Atoi(strNewRow)
			if err != nil {
				log.Printf("Error converting to int: %v", err)
				if !resultStore.IterNext(iter) {
					break
				}
				continue
			}

			compIdx := components.FindComponentRowId(intNewRow, false)
			if compIdx >= 0 && compIdx < len(core.Components) && core.Components[compIdx].Analyzed {
				err = resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
				if err != nil {
					log.Printf("Error setting value: %v", err)
				}
			}

		} else if strOldRow != "" {
			intOldRow, err := strconv.Atoi(strOldRow)
			if err != nil {
				log.Printf("Error converting to int: %v", err)
				if !resultStore.IterNext(iter) {
					break
				}
				continue
			}

			compIdx := components.FindComponentRowId(intOldRow, true)
			if compIdx >= 0 && compIdx < len(core.Components) && core.Components[compIdx].Analyzed {
				err = resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
				if err != nil {
					log.Printf("Error setting value: %v", err)
				}
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
