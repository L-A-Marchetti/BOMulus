package gui

import (
	"config"
	"core"
	"fmt"
	"report"
	"strconv"

	"github.com/gotk3/gotk3/gtk"
)

func priceCalculation(s string, win *gtk.Window) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.priceCalculation()", false).Stop()
	}
	quantity, err := strconv.Atoi(s)
	if err != nil {
		showMessageDialog(win, "Invalid Quantity Format", "Please insert a valid quantity format...")
		return
	}
	// Create a new window.
	priceWin := createWindow(fmt.Sprintf("Price with quantity %d", quantity), 300, 100)
	priceWin.Connect("destroy", func() {
		priceWin.Destroy()
	})
	// Create a vertical box.
	box := createBox(gtk.ORIENTATION_VERTICAL, 5)
	addBoxMargin(box)
	priceWin.Add(box)
	// Calculate pricing.
	totalPrice := report.QuantityPrice(quantity)
	// Create and add a label.
	label := createLabel(fmt.Sprintf("%.3f €", totalPrice))
	box.PackStart(label, false, false, 0)
	emptyLine := createLabel("")
	box.PackStart(emptyLine, true, true, 1)
	// Create and add a button.
	button := createButton("OK")
	button.Connect("clicked", func() {
		priceWin.Destroy()
	})
	box.PackStart(button, false, false, 0)
	priceWin.ShowAll()
}
