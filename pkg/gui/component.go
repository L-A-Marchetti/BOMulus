package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
	"github.com/skratchdot/open-golang/open"
)

// Function to open the component window
func ShowComponent(i int) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.ShowComponent()", true).Stop()
	}
	// Create a new window for showing a component.
	componentWindow := createWindow(core.Components[i].Mpn, 300, 200)
	// Create a vertical box container for the window
	vbox := createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	componentWindow.Add(vbox)
	// display img.
	image, _ := gtk.ImageNew()
	if core.Components[i].Img != nil {
		image.SetFromPixbuf(core.Components[i].Img)
	}
	vbox.PackStart(image, false, false, 0)
	// Empty line.
	emptyLine1 := createLabel("")
	vbox.PackStart(emptyLine1, false, false, 0)
	// Create labels for basic infos.
	componentLabels(i, vbox)
	// Empty line.
	emptyLine2 := createLabel("")
	vbox.PackStart(emptyLine2, false, false, 0)
	// Create a grid for price breaks.
	componentPricesGrid(i, vbox)
	// Empty line.
	emptyLine3 := createLabel("")
	vbox.PackStart(emptyLine3, false, false, 0)
	// Create a horizontal box for the two external link buttons (Data Sheet and Product Details)
	hBox, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 10)

	// Create the "Open Data Sheet" button with an external link icon
	dataSheetButton := createButtonWithIcon("Open Datasheet", "emblem-web") // "emblem-web" is the external link icon
	hBox.PackStart(dataSheetButton, true, true, 0)                          // Add the button to the vbox
	dataSheetButton.Connect("clicked", func() {
		// Open the Data Sheet URL in the default browser
		err := open.Run(core.Components[i].DataSheetUrl)
		core.ErrorsHandler(err)
	})

	// Create the "Product Details" button with an external link icon
	productDetailsButton := createButtonWithIcon("Open Product Details", "emblem-web")
	hBox.PackStart(productDetailsButton, true, true, 0) // Add the button to the vbox
	productDetailsButton.Connect("clicked", func() {
		// Open the Product Details URL in the default browser
		err := open.Run(core.Components[i].ProductDetailUrl)
		core.ErrorsHandler(err)
	})

	// Add the horizontal box (with both buttons) to the vertical box
	vbox.PackStart(hBox, false, false, 0)

	// Create the "OK" button
	okButton := createButton("OK")
	vbox.PackStart(okButton, false, false, 0)
	okButton.Connect("clicked", func() {
		componentWindow.Destroy() // Close the window after exporting
	})
	componentWindow.ShowAll() // Show all elements in the window
}
