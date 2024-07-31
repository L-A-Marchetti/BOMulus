package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"github.com/gotk3/gotk3/pango"
)

func BtnCompare(button *gtk.Button) {
	// Check if there's two files.
	if core.XlsmFiles[0].Path == config.INIT_FILE_PATH_1 || core.XlsmFiles[1].Path == config.INIT_FILE_PATH_2 {
		button.SetLabel(config.ONE_FILE_MSG)
		return
	}
	// Read and store both Xlsm files.
	core.XlsmReader()
	// Generate delta data.
	core.XlsmDiff()
	// Determine the maximum number of columns.
	maxColumns := core.MaxCol()
	// Create a slice of types for the ListStore.
	columnTypes := make([]glib.Type, maxColumns+4) // +4 for Operation, OldRow, NewRow, and background color.
	for i := range columnTypes {
		columnTypes[i] = glib.TYPE_STRING
	}
	// Create the ListStore with the determined types.
	var err error
	resultStore, err = gtk.ListStoreNew(columnTypes...)
	if err != nil {
		panic(err)
	}
	resultView, err = gtk.TreeViewNewWithModel(resultStore)
	if err != nil {
		panic(err)
	}
	// Add columns to TreeView
	titles := append([]string{"Operation", "Old Row", "New Row"}, core.GetColumnTitles(maxColumns)...)
	for i, title := range titles {
		cellRenderer, err := gtk.CellRendererTextNew()
		if err != nil {
			panic(err)
		}
		// Apply monospace font.
		cellRenderer.Set("font", config.OUTPUT_FONT)
		// Enable word wrap
		cellRenderer.Set("wrap-mode", pango.WRAP_WORD_CHAR)
		cellRenderer.Set("wrap-width", config.WRAP_WIDTH)

		column, err := gtk.TreeViewColumnNewWithAttribute(title, cellRenderer, "text", i)
		if err != nil {
			panic(err)
		}
		column.AddAttribute(cellRenderer, "background", maxColumns+3) // Index of the background color column
		// Determine a minimum cell size to avoid negative content width.
		column.SetMinWidth(config.CELLS_MIN_WIDTH)
		// Make the column resizable
		column.SetResizable(true)
		// Set the column to expand to fill available space
		column.SetExpand(true)

		resultView.AppendColumn(column)
	}
	// Create a ScrolledWindow, add the TreeView to it, and then add the ScrolledWindow to vBox
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
	vBox.PackStart(scrolledWindow, true, true, 0)
	vBox.ShowAll()
	Output()
}
