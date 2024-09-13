package gui

import (
	"config"
	"core"
	"fmt"

	"github.com/gotk3/gotk3/gtk"
)

func compareHeader(box *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.filters()", true).Stop()
	}
	// Create a new hBox for the checkboxes.
	checkboxesHBox := createBox(gtk.ORIENTATION_HORIZONTAL, 10)
	checkboxesHBox.PackStart(createBox(gtk.ORIENTATION_HORIZONTAL, 0), true, true, 0)
	diffSummaryText := fmt.Sprintf(
		"<span foreground='%s'>+++ INSERTS   %d</span>%s<span foreground='%s'>-+- UPDATES   %d</span>%s<span foreground='%s'>--- DELETES   %d</span>%s<span>∑   %d</span>%s<span>Δ   %d</span>%s",
		config.INSERT_BG_COLOR, core.Filters.InsertCount, config.SUMMARY_SPACING, config.NEW_UPDATE_BG_COLOR, core.Filters.UpdateCount, config.SUMMARY_SPACING, config.DELETE_BG_COLOR, core.Filters.DeleteCount, config.SUMMARY_SPACING, core.Filters.NewQuantity, config.SUMMARY_SPACING, core.Filters.NewQuantity-core.Filters.OldQuantity, config.SUMMARY_SPACING,
	)
	diffSummaryLabel := createLabel("")
	diffSummaryLabel.SetMarkup(diffSummaryText)
	checkboxesHBox.PackStart(diffSummaryLabel, false, false, 0)
	// Create the analyze button and the progress bar.
	analyzeButtonBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	btnAnalyze(analyzeButtonBox)
	checkboxesHBox.PackStart(analyzeButtonBox, false, false, 0)
	checkboxesHBox.PackStart(createBox(gtk.ORIENTATION_HORIZONTAL, 0), true, true, 0)
	box.PackStart(checkboxesHBox, false, false, 0)
}
