package gui

import (
	"components"
	"config"
	"core"
	"fmt"
	"os"

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
	// Read and store both Xlsm files.
	core.XlsmReader()
	// Try to detect automatically the header.
	components.HeaderDetection()
	components.ComponentsDetection()
	// Generate delta data.
	core.XlsmDiff()
	for _, component := range core.Components {
		if component.Operator == "INSERT" || component.Operator == "DELETE" {
			fmt.Println(component)
		}
	}
	// Point break
	os.Exit(0)
	// Generate the filters box.
	avoidDuplicate()
	filtersHBox := filters()
	vBox.Add(filtersHBox)
	// Update the view
	UpdateView()
}
