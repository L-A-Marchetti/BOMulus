package gui

import (
	"config"
	"core"
	"fmt"
	"strconv"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

func btnPressedComponent() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.btnPressedComponent()", false).Stop()
	}
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
						ShowComponent(-1, convCol1Value, true)
					} else {
						convCol2Value, _ := strconv.Atoi(col2Value)
						ShowComponent(-1, convCol2Value, false)
					}
					return true
				}
			}
		}
		return false
	})
}

func colEdition() {
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

func btnMouseHover() {
	var lastHoveredPath *gtk.TreePath // Variable to track the last hovered path in column 3
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
