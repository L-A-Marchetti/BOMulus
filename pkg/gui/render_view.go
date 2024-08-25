package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

// Generate a ListStore and a TreeView.
func RenderView(maxColumns int) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.RenderView()", false).Stop()
	}
	// Create a list of types for ListStore.
	columnTypes := make([]glib.Type, (maxColumns+4)*2) // +4 for Operation, OldRow, NewRow, and Analyze.
	for i := range columnTypes {
		columnTypes[i] = glib.TYPE_STRING
	}
	// Create the ListStore with the determined types.
	var err error
	resultStore, err = gtk.ListStoreNew(columnTypes...)
	core.ErrorsHandler(err)
	resultView, err = gtk.TreeViewNewWithModel(resultStore)
	core.ErrorsHandler(err)
	// Disable the visual selection completely
	selection, _ := resultView.GetSelection()
	selection.SetMode(gtk.SELECTION_NONE)
	// Add columns to the TreeView
	titles := append([]string{"≠", "◌", "●", "☑"}, core.GetColumnTitles(maxColumns)...)
	for i, title := range titles {
		var column *gtk.TreeViewColumn
		if i == 3 {
			// Add an icon-based button to the third column
			buttonRenderer, _ := gtk.CellRendererPixbufNew()
			column, _ = gtk.TreeViewColumnNewWithAttribute(title, buttonRenderer, "icon-name", i)
			column.SetClickable(true) // Make the column clickable
			// Render and setup cells.
			cellRenderer := CellsProperties()
			// Change font size for the btn char.
			cellRenderer.Set("font", config.INFO_BTN_CHAR_FONT)
			// Render and setup columns.
			column = ColumnProperties(title, maxColumns, i, cellRenderer)
		} else {
			// Render and setup cells.
			cellRenderer := CellsProperties()
			// Render and setup columns.
			column = ColumnProperties(title, maxColumns, i, cellRenderer)
			// Connect the edited signal to update the model
			cellRenderer.Connect("edited", func(renderer *gtk.CellRendererText, path string, newText string) {
				iter, err := resultStore.GetIterFromString(path)
				core.ErrorsHandler(err)
				resultStore.SetValue(iter, i, newText)
			})
		}
		// Append column to the result view.
		resultView.AppendColumn(column)
	}
	// Connect the "button-press-event" for single click
	btnPressedComponent()
	// Handle editing manually with a double-click
	colEdition()
	// Mouse hover for the components buttons.
	btnMouseHover()
}
