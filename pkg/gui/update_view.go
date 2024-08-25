package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

var (
	scrolledVBox     *gtk.Box
	diffSummaryLabel *gtk.Label
)

func UpdateView() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.UpdateView()", true).Stop()
	}
	// Generate labels for diff summary.
	diffSummaryLabel = DiffSummary()
	// Generate the filters box.
	filtersHBox := filters()
	// Determine the maximum number of columns.
	maxColumns := core.MaxCol()
	// Generate a ListStore and a TreeView.
	RenderView(maxColumns)
	// Create a ScrolledWindow and add the TreeView
	scrolledWindow := createScrolledWindow()
	// Remove the existing scrolledVBox if it exists
	if scrolledVBox != nil {
		vBox.Remove(scrolledVBox)
	}
	// Create a new vBox for the ScrolledWindow
	scrolledVBox = createBox(gtk.ORIENTATION_VERTICAL, 0)
	// Add the diff summary and the resultview to the scrolledVBox.
	scrolledVBox.PackStart(diffSummaryLabel, false, false, 0)
	filtersHBox.SetMarginBottom(10)
	scrolledVBox.PackStart(filtersHBox, false, false, 0)
	scrolledVBox.PackStart(scrolledWindow, true, true, 0)
	// Add the new elements
	vBox.PackStart(scrolledVBox, true, true, 0)
	vBox.ShowAll()
	Output()
}
