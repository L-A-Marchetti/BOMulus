package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

var (
	resultView  *gtk.TreeView
	resultStore *gtk.ListStore
	vBox        *gtk.Box
)

func GuiInit() {
	var guiInitBenchmark *core.BenchmarkTimer
	if config.DEBUGGING {
		guiInitBenchmark = core.StartBenchmark("GuiInit()", true)
	}
	// Initialize GTK.
	gtk.Init(nil)
	// Create the main window.
	win := createWindow(config.TITLE, config.WIN_WIDTH, config.WIN_HEIGHT)
	// Setup the icon.
	setWindowIcon(win)
	// Create the compare button.
	compareButton := createButton(config.INIT_BUTTON_LABEL)
	// Connect the button click event to the BtnCompare function.
	compareButton.Connect("clicked", BtnCompare)
	// Create drag & drop boxes.
	dragAndDropBoxes := createDragAndDropBoxes(compareButton)
	// Create a vertical box container to hold drag and drop boxes and the compare button.
	vBox = createBox(gtk.ORIENTATION_VERTICAL, 6)
	vBox.PackStart(dragAndDropBoxes, false, false, 0)
	vBox.PackStart(compareButton, false, false, 0)
	win.Add(vBox)
	win.ShowAll()
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})
	if config.DEBUGGING {
		guiInitBenchmark.Stop()
	}
	// Run the main GTK loop.
	gtk.Main()
}
