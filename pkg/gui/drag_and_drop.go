package gui

import (
	"fmt"
	"strings"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

func SetupDragAndDrop(widget *gtk.Box) {
	// Create a target entry for file URIs.
	targetEntry, _ := gtk.TargetEntryNew("text/uri-list", gtk.TARGET_OTHER_APP, 0)

	// Enable drag-and-drop for the widget.
	widget.DragDestSet(gtk.DEST_DEFAULT_ALL, []gtk.TargetEntry{*targetEntry}, gdk.ACTION_COPY)

	// Connect the "drag-data-received" signal to a callback function.
	widget.Connect("drag-data-received", func(widget *gtk.Box, context *gdk.DragContext, x, y int, selectionData *gtk.SelectionData, info uint, time uint32) {
		data := selectionData.GetData()
		uris := string(data)
		fmt.Println("Received data:", uris)

		// Parse URIs.
		for _, uri := range ParseUris(uris) {
			fmt.Println("URI:", uri)
		}
	})
}

func ParseUris(uris string) []string {
	var files []string
	for _, uri := range strings.Split(uris, "\n") {
		if len(uri) > 0 {
			// Convert URI to file path.
			file := UriToFilename(uri)
			files = append(files, file)
		}
	}
	return files
}

func UriToFilename(uri string) string {
	uri = strings.TrimPrefix(uri, "file://")
	return uri
}
