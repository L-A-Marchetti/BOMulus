package gui

import (
	"config"
	"core"
	"path/filepath"
	"strings"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

func SetupDragAndDrop(widget *gtk.Box, boxIdx int, label *gtk.Label, button *gtk.Button) {
	// Create a target entry for file URIs.
	targetEntry, _ := gtk.TargetEntryNew("text/uri-list", gtk.TARGET_OTHER_APP, 0)
	// Enable drag-and-drop for the widget.
	widget.DragDestSet(gtk.DEST_DEFAULT_ALL, []gtk.TargetEntry{*targetEntry}, gdk.ACTION_COPY)
	// Connect the "drag-data-received" signal to a callback function.
	widget.Connect("drag-data-received", func(widget *gtk.Box, context *gdk.DragContext, x, y int, selectionData *gtk.SelectionData, info uint, time uint32) {
		data := selectionData.GetData()
		uris := strings.Split(string(data), "\n")
		if len(uris) > 0 && uris[0] != "" {
			// Remove the "file://" prefix and any trailing whitespace
			filename := strings.TrimSpace(strings.TrimPrefix(uris[0], config.FILE_PREFIX))
			// Check if the file has .xlsm extension
			if strings.ToLower(filepath.Ext(filename)) == config.FILE_EXT {
				// Update the label with the filename
				label.SetText(filepath.Base(filename))
				// Update the XlsmFiles slice
				switch boxIdx {
				case 1:
					core.XlsmFiles[0].Path = filename
				case 2:
					core.XlsmFiles[1].Path = filename
				}
				// Reset the button label.
				button.SetLabel(config.INIT_BUTTON_LABEL)
			} else {
				// If not an .xlsm file, update the label with an error message
				label.SetText(config.WRONG_EXT_MSG)
			}
		}
	})
}
