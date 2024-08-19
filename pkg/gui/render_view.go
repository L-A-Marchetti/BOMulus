package gui

import (
	"config"
	"core"
	"fmt"
	"strconv"

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
			// Connect the "button-press-event" for single click
			resultView.Connect("button-press-event", func(tv *gtk.TreeView, event *gdk.Event) bool {
				buttonEvent := gdk.EventButtonNewFromEvent(event)
				if buttonEvent.Button() == gdk.BUTTON_PRIMARY && buttonEvent.Type() == gdk.EVENT_BUTTON_PRESS {
					x := int(buttonEvent.X())
					y := int(buttonEvent.Y())
					path, column, _, _, _ := resultView.GetPathAtPos(x, y)
					if path != nil && column != nil {
						if column.GetTitle() == "☑" {
							// Get iter.
							iter, err := resultStore.GetIter(path)
							if err != nil {
								fmt.Println(err)
								return false
							}
							// Check the value of column 3
							col3Pointer, _ := resultStore.GetValue(iter, 3)
							col3Value, _ := col3Pointer.GetString()
							if col3Value == "" {
								// If the value is empty, do nothing
								return false
							}
							// Get col 1 & 2 values.
							col1Pointer, _ := resultStore.GetValue(iter, 1)
							col2Pointer, _ := resultStore.GetValue(iter, 2)
							// Get values from pointers.
							col1Value, _ := col1Pointer.GetString()
							col2Value, _ := col2Pointer.GetString()
							if col2Value == "" {
								convCol1Value, _ := strconv.Atoi(col1Value)
								ShowComponent(convCol1Value, true)
							} else {
								convCol2Value, _ := strconv.Atoi(col2Value)
								ShowComponent(convCol2Value, false)
							}
							return true
						}
					}
				}
				return false
			})
		} else {
			// Render and setup cells.
			cellRenderer := CellsProperties()
			// Render and setup columns.
			column = ColumnProperties(title, maxColumns, i, cellRenderer)
			// Connect the edited signal to update the model
			cellRenderer.Connect("edited", func(renderer *gtk.CellRendererText, path string, newText string) {
				iter, err := resultStore.GetIterFromString(path)
				if err != nil {
					panic(err)
				}
				resultStore.SetValue(iter, i, newText)
			})
		}
		// Append column to the result view.
		resultView.AppendColumn(column)
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
	// Variable to track the last hovered path in column 3
	var lastHoveredPath *gtk.TreePath

	resultView.Connect("motion-notify-event", func(tv *gtk.TreeView, event *gdk.Event) bool {
		motionEvent := gdk.EventMotionNewFromEvent(event)
		x, y := motionEvent.MotionVal()
		path, column, _, _, _ := tv.GetPathAtPos(int(x), int(y))
		if path != nil && column != nil && column.GetTitle() == "☑" {
			// Get iter.
			iter, err := resultStore.GetIter(path)
			if err != nil {
				fmt.Println(err)
				return false
			}
			// Check the value of column 3
			col3Pointer, _ := resultStore.GetValue(iter, 3)
			col3Value, _ := col3Pointer.GetString()

			if col3Value == "" {
				// If the value is empty, do nothing
				return false
			}
			// Mouse is in column 3
			if lastHoveredPath == nil || lastHoveredPath.String() != path.String() {
				// New cell or entering column 3
				if lastHoveredPath != nil {
					// Reset the old cell if it exists
					iter, _ := resultStore.GetIter(lastHoveredPath)
					resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
				}
				// Update the new cell
				iter, _ := resultStore.GetIter(path)
				resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR_HOVER)
				lastHoveredPath, _ = path.Copy()
			}
		} else if lastHoveredPath != nil {
			// Mouse is outside column 3, reset the last hovered cell
			iter, _ := resultStore.GetIter(lastHoveredPath)
			resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
			lastHoveredPath = nil
		}

		return false
	})
}
