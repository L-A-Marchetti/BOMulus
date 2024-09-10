package gui

import (
	"config"
	"core"
	"fmt"
	"report"
	"strconv"

	"github.com/gotk3/gotk3/gtk"
)

func priceCalculation(s string, win *gtk.Window, currency string) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.priceCalculation()", false).Stop()
	}
	quantity, err := strconv.Atoi(s)
	if err != nil {
		showMessageDialog(win, "Invalid Quantity Format", "Please insert a valid quantity format...")
		return
	}
	// Create a new window.
	priceWin := createWindow(fmt.Sprintf("Price for [%d] piece(s)", quantity), 300, 100)
	priceWin.Connect("destroy", func() {
		priceWin.Destroy()
	})
	// Calculate pricing.
	totalPrice, priceDiff, minimumQuantity := report.QuantityPrice(quantity)
	if len(minimumQuantity) != 0 {
		minimumQuantityList := ""
		for _, minimum := range minimumQuantity {
			minimumQuantityList += minimum + "\n"
		}
		showMessageDialog(priceWin, "Minimum quantity is not reached", minimumQuantityList)
	}
	// Create a vertical box.
	box := createBox(gtk.ORIENTATION_VERTICAL, 5)
	addBoxMargin(box)
	priceWin.Add(box)
	// Create and add a label.
	totalPriceText := ""
	priceDiffText := ""
	pricePieceText := ""
	if currency == "€" {
		totalPriceText = fmt.Sprintf("BOM total price for [%d] piece(s): %.3f €", quantity, totalPrice)
		priceDiffText = fmt.Sprintf("Price diff/piece: %.3f €", priceDiff/float64(quantity))
		pricePieceText = fmt.Sprintf("Price/piece: %.3f €", totalPrice/float64(quantity))
	} else if currency == "$" {
		totalPriceText = fmt.Sprintf("BOM total price for [%d] piece(s): $%.3f", quantity, totalPrice)
		priceDiffText = fmt.Sprintf("Price diff/piece: $%.3f", priceDiff/float64(quantity))
		pricePieceText = fmt.Sprintf("Price/piece: $%.3f", totalPrice/float64(quantity))
	}
	label := createLabel(totalPriceText)
	box.PackStart(label, false, false, 0)
	emptyLine := createLabel("")
	box.PackStart(emptyLine, true, true, 0)
	label2 := createLabel(priceDiffText)
	box.PackStart(label2, false, false, 0)
	emptyLine2 := createLabel("")
	box.PackStart(emptyLine2, true, true, 0)
	label3 := createLabel(pricePieceText)
	box.PackStart(label3, false, false, 0)
	emptyLine3 := createLabel("")
	box.PackStart(emptyLine3, true, true, 0)
	// Create and add a button.
	button := createButton("OK")
	button.Connect("clicked", func() {
		priceWin.Destroy()
	})
	box.PackStart(button, false, false, 0)
	priceWin.ShowAll()
}
