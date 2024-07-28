package gui

import "github.com/gotk3/gotk3/gtk"

func GuiInit() {
	// Initialize GTK.
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
	// Create labels for boxes.
	label1, err := gtk.LabelNew("Drag and drop a file here")
	if err != nil {
		panic(err)
	}
	label2, err := gtk.LabelNew("Drag and drop a file here")
	if err != nil {
		panic(err)
	}
	// Create the depot boxes.
	box1, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}
	box2, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}
	// Add labels to boxes.
	box1.Add(label1)
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
	// apply style to the boxes.
	Stylize(box1)
	Stylize(box2)
	// Make the window and all its contents visible.
	win.ShowAll()
	// Set up drag and drop functionality for both boxes.
	SetupDragAndDrop(box1)
	SetupDragAndDrop(box2)
	// Connect the destroy signal to the main GTK loop exit.
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})
	// Run the main GTK loop.
	gtk.Main()
}
