package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

func BtnCompare(button *gtk.Button) {
	// Check if there are two files.
	if core.XlsmFiles[0].Path == config.INIT_FILE_PATH_1 || core.XlsmFiles[1].Path == config.INIT_FILE_PATH_2 {
		button.SetLabel(config.ONE_FILE_MSG)
		return
	}
	// Read and store both Xlsm files.
	core.XlsmReader()
	// Generate delta data.
	core.XlsmDiff()
	// Generate labels for diff summary.
	diffSummaryLabel := DiffSummary()
	// Determine the maximum number of columns.
	maxColumns := core.MaxCol()
	// Generate a ListStore and a TreeView.
	RenderView(maxColumns)
	// Create a ScrolledWindow and add the TreeView
	scrolledWindow, err := gtk.ScrolledWindowNew(nil, nil)
	if err != nil {
		panic(err)
	}
	scrolledWindow.SetPolicy(config.SCROLLBAR_POLICY, config.SCROLLBAR_POLICY)
	scrolledWindow.Add(resultView)
	scrolledWindow.SetVExpand(true)
	scrolledWindow.SetHExpand(true)
	// Enlarge scrollbars.
	EnlargeSb()
	// Remove any existing TreeView from vBox and add the new one
	children := vBox.GetChildren()
	for l := children; l != nil; l = l.Next() {
		child := l.Data()
		if sw, ok := child.(*gtk.ScrolledWindow); ok {
			vBox.Remove(sw)
		}
	}
	vBox.PackStart(diffSummaryLabel, false, false, 0)
	vBox.PackStart(scrolledWindow, true, true, 0)
	vBox.ShowAll()
	Output()
}
