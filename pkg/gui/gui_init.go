package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

func GuiInit() {
	var guiInitBenchmark *core.BenchmarkTimer
	if config.DEBUGGING {
		guiInitBenchmark = core.StartBenchmark("gui.GuiInit()", true)
	}
	gtk.Init(nil)
	win := createWindow(config.TITLE, 0, 0)
	setWindowIcon(win)
	compareButton := createButton(config.INIT_BUTTON_LABEL)
	compareButton.Connect("clicked", BtnCompare)
	dragAndDropBoxes := createDragAndDropBoxes(compareButton)
	vBox := createBox(gtk.ORIENTATION_VERTICAL, 6)
	vBox.PackStart(dragAndDropBoxes, false, false, 0)
	vBox.PackStart(compareButton, false, false, 20)
	win.Add(vBox)
	win.ShowAll()
	win.Connect("destroy", func() {
		gtk.MainQuit()
	})
	if config.DEBUGGING {
		guiInitBenchmark.Stop()
	}
	gtk.Main()
}
