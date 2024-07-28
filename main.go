package main

import (
	"fmt"
	"strings"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

func main() {
	// Initialize GTK without parsing any command line arguments.
	gtk.Init(nil)

	// Create a new top-level window.
	win, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		panic(err)
	}

	// Set the title of the window.
	win.SetTitle("BOMulus")
	// Set the default size of the window.
	win.SetDefaultSize(800, 600)

	// Create a new Label for the first box.
	label1, err := gtk.LabelNew("Drag and drop a file here")
	if err != nil {
		panic(err)
	}

	// Create the first box to hold the label.
	box1, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}

	// Add the label to the first box.
	box1.Add(label1)

	// Create a new Label for the second box.
	label2, err := gtk.LabelNew("Drag and drop a file here")
	if err != nil {
		panic(err)
	}

	// Create the second box to hold the label.
	box2, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}

	// Add the label to the second box.
	box2.Add(label2)

	// Create a horizontal box container to hold both boxes side by side.
	hBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 6)
	if err != nil {
		panic(err)
	}

	// Add both boxes to the horizontal box container.
	hBox.PackStart(box1, true, true, 0)
	hBox.PackStart(box2, true, true, 0)

	// Add the horizontal box container to the window.
	win.Add(hBox)

	// Apply CSS to add a border to both boxes.
	applyCSS(box1)
	applyCSS(box2)

	// Make the window and all its contents visible.
	win.ShowAll()

	// Set up drag and drop functionality for both boxes.
	setupDragAndDrop(box1)
	setupDragAndDrop(box2)

	// Connect the destroy signal to the main GTK loop exit.
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})

	// Run the main GTK loop.
	gtk.Main()
}

func setupDragAndDrop(widget *gtk.Box) {
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
		for _, uri := range parseUris(uris) {
			fmt.Println("URI:", uri)
		}
	})
}

func parseUris(uris string) []string {
	var files []string
	for _, uri := range strings.Split(uris, "\n") {
		if len(uri) > 0 {
			// Convert URI to file path.
			file := uriToFilename(uri)
			files = append(files, file)
		}
	}
	return files
}

func uriToFilename(uri string) string {
	uri = strings.TrimPrefix(uri, "file://")
	return uri
}

func applyCSS(widget *gtk.Box) {
	cssProvider, _ := gtk.CssProviderNew()
	screen, _ := gdk.ScreenGetDefault()

	// Load CSS
	css := `
	#box {
		border: 2px solid black;
		border-radius: 5px;
		padding: 50px;
		margin: 50px;
	}
	`
	cssProvider.LoadFromData(css)

	// Apply the CSS to the screen
	gtk.AddProviderForScreen(screen, cssProvider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)

	// Set the CSS name of the widget
	widget.SetName("box")
}
