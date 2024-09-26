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
	win.SetDefaultSize(700, 400)
	setWindowIcon(win)

	compareButton := createButton(config.INIT_BUTTON_LABEL)
	compareButton.SetName("compare-button")
	stylize(compareButton, config.BTN_COMPARE_CSS, "compare-button")

	compareButton.Connect("clicked", BtnCompare)

	dragAndDropBoxes := createDragAndDropBoxes(compareButton)

	vBox := createBox(gtk.ORIENTATION_VERTICAL, 0)
	vBox.SetVExpand(true)
	vBox.SetHExpand(true)

	vBox.PackStart(dragAndDropBoxes, true, true, 0)
	vBox.PackStart(compareButton, false, false, 0)

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
