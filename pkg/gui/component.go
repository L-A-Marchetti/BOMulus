package gui

import (
	"components"
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
	"github.com/skratchdot/open-golang/open"
)

// Function to open the component window
func ShowComponent(idx, i int, isOld bool) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.ShowComponent()", true).Stop()
	}
	// Find the specifig component.
	if idx == -1 {
		idx = components.FindComponentRowId(i, isOld)
	}
	// Create a new window for showing a component.
	componentWindow := createWindow(core.Components[idx].Mpn, 300, 200)
	// Create a vertical box container for the window
	vbox := createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	componentWindow.Add(vbox)
	// Create an img.
	image, _ := gtk.ImageNew()
	if core.Components[idx].Img != nil {
		image.SetFromPixbuf(core.Components[idx].Img)
	}
	vbox.PackStart(image, false, false, 0)
	// Create labels for basic infos.
	componentLabels(idx, vbox)
	// Create a grid for price breaks.
	componentPricesGrid(idx, vbox)
	// Create the Data sheet button.
	dataSheetButton := createButton("Open Data Sheet")
	vbox.PackStart(dataSheetButton, false, false, 0)
	dataSheetButton.Connect("clicked", func() {
		err := open.Run(core.Components[idx].DataSheetUrl)
		core.ErrorsHandler(err)
	})
	// Create the "OK" button
	okButton := createButton("OK")
	vbox.PackStart(okButton, false, false, 0)
	okButton.Connect("clicked", func() {
		componentWindow.Destroy() // Close the window after exporting
	})
	componentWindow.ShowAll() // Show all elements in the window
}
