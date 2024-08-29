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
	// Calculate pricing.
	totalPrice, priceDiff, err := report.QuantityPrice(quantity)
	if err != nil {
		showMessageDialog(win, "Minimum quantity is not reached", err.Error())
		return
	}
	// Create a new window.
	priceWin := createWindow(fmt.Sprintf("Price for [%d] piece(s)", quantity), 300, 100)
	priceWin.Connect("destroy", func() {
		priceWin.Destroy()
	})
	// Create a vertical box.
	box := createBox(gtk.ORIENTATION_VERTICAL, 5)
	addBoxMargin(box)
	priceWin.Add(box)
	// Create and add a label.
	label := createLabel(fmt.Sprintf("BOM total price for [%d] piece(s): %.3f €", quantity, totalPrice))
	box.PackStart(label, false, false, 0)
	emptyLine := createLabel("")
	box.PackStart(emptyLine, true, true, 0)
	label2 := createLabel(fmt.Sprintf("Price diff: %.3f €", priceDiff))
	box.PackStart(label2, false, false, 0)
	emptyLine2 := createLabel("")
	box.PackStart(emptyLine2, true, true, 0)
	// Create and add a button.
	button := createButton("OK")
	button.Connect("clicked", func() {
		priceWin.Destroy()
	})
	box.PackStart(button, false, false, 0)
	priceWin.ShowAll()
}
