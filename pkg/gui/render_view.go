package gui

import (
	"core"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

// Generate a ListStore and a TreeView.
func RenderView(maxColumns int) {
	// Create a list of types for ListStore.
	columnTypes := make([]glib.Type, (maxColumns+4)*2) // +4 for Operation, OldRow, NewRow, and Analyze.
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
	// Disable the visual selection completely
	selection, _ := resultView.GetSelection()
	selection.SetMode(gtk.SELECTION_NONE)
	// Add columns to the TreeView
	titles := append([]string{"≠", "◌", "●", "☑"}, core.GetColumnTitles(maxColumns)...)
	for i, title := range titles {
		// Render and setup cells.
		cellRenderer := CellsProperties()
		// Render and setup columns.
		column := ColumnProperties(title, maxColumns, i, cellRenderer)
		// Append column to the result view.
		resultView.AppendColumn(column)
		// Connect the edited signal to update the model
		cellRenderer.Connect("edited", func(renderer *gtk.CellRendererText, path string, newText string) {
			iter, err := resultStore.GetIterFromString(path)
			if err != nil {
				panic(err)
			}
			resultStore.SetValue(iter, i, newText)
		})
	}
	// Handle editing manually with a double-click
	resultView.Connect("button-press-event", func(tv *gtk.TreeView, event *gdk.Event) bool {
		buttonEvent := gdk.EventButtonNewFromEvent(event)
		if buttonEvent.Button() == gdk.BUTTON_PRIMARY && buttonEvent.Type() == gdk.EVENT_2BUTTON_PRESS {
			x := int(buttonEvent.X())
			y := int(buttonEvent.Y())
			path, column, _, _, _ := resultView.GetPathAtPos(x, y)
			if path != nil && column != nil {
				resultView.SetCursor(path, column, true)
				return true
			}
		}
		return false
	})
}
