package gui

import (
	"config"

	"github.com/gotk3/gotk3/gtk"
)

var resultView *gtk.TreeView
var resultStore *gtk.ListStore
var vBox *gtk.Box

func GuiInit() {
	// Initialize GTK.
	gtk.Init(nil)
	// Create a new top-level window.
	win, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		panic(err)
	}
	// Set the title of the window.
	win.SetTitle(config.TITLE)
	// Set the default size of the window.
	win.SetDefaultSize(config.WIN_WIDTH, config.WIN_HEIGHT)
	// Create labels for boxes.
	label1, err := gtk.LabelNew(config.INIT_BOX_MSG)
	if err != nil {
		panic(err)
	}
	label2, err := gtk.LabelNew(config.INIT_BOX_MSG)
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
	hBox.PackStart(box1, true, false, 0)
	hBox.PackStart(box2, true, false, 0)
	// Create a vertical box container to hold the horizontal box and the button.
	vBox, err = gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 6)
	if err != nil {
		panic(err)
	}
	// Add the horizontal box container to the vertical box container.
	vBox.PackStart(hBox, false, false, 0)
	// Create the button.
	button, err := gtk.ButtonNewWithLabel(config.INIT_BUTTON_LABEL)
	if err != nil {
		panic(err)
	}
	// Connect the button click event to the BtnCompare function.
	button.Connect("clicked", BtnCompare)
	// Add the button to the vertical box container.
	vBox.PackStart(button, false, false, 0)
	// Add the vertical box container to the window.
	win.Add(vBox)
	// Apply style to the boxes.
	Stylize(box1)
	Stylize(box2)
	// Make the window and all its contents visible.
	win.ShowAll()
	// Set up drag and drop functionality for both boxes.
	SetupDragAndDrop(box1, 1, label1, button)
	SetupDragAndDrop(box2, 2, label2, button)
	// Connect the destroy signal to the main GTK loop exit.
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})
	// Run the main GTK loop.
	gtk.Main()
}
