package gui

import (
	"components"
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

func BtnCompare(button *gtk.Button) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.BtnCompare()", true).Stop()
	}
	// Check if there are two files.
	if core.XlsmFiles[0].Path == config.INIT_FILE_PATH_1 || core.XlsmFiles[1].Path == config.INIT_FILE_PATH_2 {
		button.SetLabel(config.ONE_FILE_MSG)
		return
	}
	core.XlsmReader()
	components.HeaderDetection()
	components.ComponentsDetection()
	core.XlsmDiff()
	compareView()
	/*
		// Generate the filters box.
		avoidDuplicate()
		filtersHBox := filters()
		vBox.Add(filtersHBox)
		// Update the view
		UpdateView()
	*/
}
