package gui

import (
	"config"
	"core"
	"fmt"
	"strings"

	"github.com/gotk3/gotk3/gtk"
)

var (
	compareWindow  *gtk.Window
	scrolledWindow *gtk.ScrolledWindow
	vbox           *gtk.Box
)

func compareView() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.compareView()", true).Stop()
	}
	// Create a new window for showing the report.
	oldName, newName := strings.Split(core.XlsmFiles[0].Path, "/"), strings.Split(core.XlsmFiles[1].Path, "/")
	compareTitle := fmt.Sprintf("%s/%s", strings.Split(oldName[len(oldName)-1], ".")[0], strings.Split(newName[len(newName)-1], ".")[0])
	if compareWindow != nil {
		scrolledWindow.Remove(vbox)
		compareWindow.SetTitle(compareTitle)
	} else {
		compareWindow = createWindow(compareTitle, 1200, 900)
		scrolledWindow = createCommonScrolledWindow()
		compareWindow.Add(scrolledWindow)
	}
	vbox = createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	scrolledWindow.Add(vbox)
	compareHeader(vbox)
	createCompareGrid(vbox)
	compareWindow.ShowAll()
}
