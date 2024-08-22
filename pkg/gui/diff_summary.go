package gui

import (
	"components"
	"config"
	"core"
	"fmt"
	"log"

	"github.com/gotk3/gotk3/gtk"
)

func DiffSummary() *gtk.Label {
	deleteCount, insertCount, updateCount := 0, 0, 0
	for _, delta := range core.XlsmDeltas {
		switch delta.Operator {
		case "DELETE":
			deleteCount++
		case "INSERT":
			insertCount++
		case "UPDATE":
			updateCount++
		}
	}
	// Try to dedect components (only before analysis is launched).
	if !core.AnalysisState.InProgress && !core.AnalysisState.Completed {
		components.ComponentsDetection()
	}
	// Create a label with a formatted text.
	diffSummaryText := fmt.Sprintf(
		"<span foreground='%s'>--- DELETES   %d</span>%s<span foreground='%s'>+++ INSERTS   %d</span>%s<span foreground='%s'>-+- UPDATES   %d</span>%s<span>∑   %d</span>%s<span>Δ   %d</span>",
		config.DELETE_BG_COLOR, deleteCount, config.SUMMARY_SPACING, config.INSERT_BG_COLOR, insertCount, config.SUMMARY_SPACING, config.OLD_UPDATE_BG_COLOR, updateCount, config.SUMMARY_SPACING, components.CompTotalQuantity(), config.SUMMARY_SPACING, components.CompQuantityDiff(),
	)
	diffSummaryLabel, err := gtk.LabelNew("")
	if err != nil {
		log.Fatal("Unable to create label:", err)
	}
	diffSummaryLabel.SetMarkup(diffSummaryText)
	diffSummaryLabel.SetMarginBottom(10)
	return diffSummaryLabel
}
