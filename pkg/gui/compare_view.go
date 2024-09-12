package gui

import (
	"config"
	"core"
	"fmt"
	"strings"

	"github.com/gotk3/gotk3/gtk"
)

func compareView() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.compareView()", true).Stop()
	}
	// Create a new window for showing the report.
	oldName, newName := strings.Split(core.XlsmFiles[0].Path, "/"), strings.Split(core.XlsmFiles[1].Path, "/")
	compareTitle := fmt.Sprintf("%s/%s", strings.Split(oldName[len(oldName)-1], ".")[0], strings.Split(newName[len(newName)-1], ".")[0])
	compareWindow := createWindow(compareTitle, 1200, 900)
	scrolledWindow := createCommonScrolledWindow()
	vbox := createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	scrolledWindow.Add(vbox)
	compareWindow.Add(scrolledWindow)
	createCompareGrid(vbox)
	compareWindow.ShowAll()
}
