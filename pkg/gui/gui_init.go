package gui

import (
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

var resultView *gtk.TreeView
var resultStore *gtk.ListStore

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
	// Create a vertical box container to hold the horizontal box and the button.
	vBox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}
	// Add the horizontal box container to the vertical box container.
	vBox.PackStart(hBox, true, true, 0)
	// Create the button.
	button, err := gtk.ButtonNewWithLabel("Compare")
	if err != nil {
		panic(err)
	}
	// Connect the button click event to the BtnCompare function.
	button.Connect("clicked", BtnCompare)
	// Add the button to the vertical box container.
	vBox.PackStart(button, false, false, 0)
	// Create a ListStore with 5 columns: 4 for data and 1 for background color
	resultStore, err = gtk.ListStoreNew(glib.TYPE_STRING, glib.TYPE_STRING, glib.TYPE_STRING, glib.TYPE_STRING, glib.TYPE_STRING)
	if err != nil {
		panic(err)
	}
	resultView, err = gtk.TreeViewNewWithModel(resultStore)
	if err != nil {
		panic(err)
	}
	// Add columns to TreeView
	for i, title := range []string{"Operation", "Old Row", "New Row", "Content"} {
		cellRenderer, err := gtk.CellRendererTextNew()
		if err != nil {
			panic(err)
		}
		column, err := gtk.TreeViewColumnNewWithAttribute(title, cellRenderer, "text", i)
		if err != nil {
			panic(err)
		}
		column.AddAttribute(cellRenderer, "background", 4)
		resultView.AppendColumn(column)
	}
	// Create a ScrolledWindow, add the TreeView to it, and then add the ScrolledWindow to vBox
	scrolledWindow, err := gtk.ScrolledWindowNew(nil, nil)
	if err != nil {
		panic(err)
	}
	scrolledWindow.SetPolicy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)
	scrolledWindow.Add(resultView)
	// Add the scrolled window to the vertical box container.
	vBox.PackStart(scrolledWindow, true, true, 0)
	// Add the vertical box container to the window.
	win.Add(vBox)
	// apply style to the boxes.
	Stylize(box1)
	Stylize(box2)
	// Make the window and all its contents visible.
	win.ShowAll()
	// Set up drag and drop functionality for both boxes.
	SetupDragAndDrop(box1, 1)
	SetupDragAndDrop(box2, 2)
	// Connect the destroy signal to the main GTK loop exit.
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})
	// Run the main GTK loop.
	gtk.Main()
}
