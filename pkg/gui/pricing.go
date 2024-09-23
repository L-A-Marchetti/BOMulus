package gui

import (
    "config"
    "core"
    "fmt"
    "report"
    "strconv"

    "github.com/gotk3/gotk3/gtk"
)

func calculatePrice(s string, win *gtk.Window, currency string) {
    if config.DEBUGGING {
        defer core.StartBenchmark("gui.calculatePrice()", false).Stop()
    }
    quantity, err := strconv.Atoi(s)
    if err != nil {
        showMessageDialog(win, "Format de quantité invalide", "Veuillez insérer un format de quantité valide...")
        return
    }
    // Création d'une nouvelle fenêtre.
    priceWin := createWindow(fmt.Sprintf("Prix pour [%d] pièce(s)", quantity), 300, 100)
    priceWin.Connect("destroy", func() {
        priceWin.Destroy()
    })
    // Calcul du prix.
    _, totalPrice, unitPrice, unitPriceDiff, minimumQuantity, currency := report.QuantityPrice(quantity)

    if len(minimumQuantity) != 0 {
        minimumQuantityList := ""
        for _, minimum := range minimumQuantity {
            minimumQuantityList += minimum + "\n"
        }
        showMessageDialog(priceWin, "Quantité minimum non atteinte", minimumQuantityList)
    }
    // Création d'un conteneur vertical.
    box := createBox(gtk.ORIENTATION_VERTICAL, 5)
    addBoxMargin(box)
    priceWin.Add(box)
    // Création et ajout d'un label.
    totalPriceText := ""
    unitPriceText := ""
    unitPriceDiffText := ""

    if currency == "€" || currency == "$" {
        totalPriceText = fmt.Sprintf("Prix total pour [%d] pièce(s) : %.2f %s", quantity, totalPrice, currency)
        unitPriceText = fmt.Sprintf("Prix unitaire : %.2f %s", unitPrice, currency)
        unitPriceDiffText = fmt.Sprintf("Différence de prix unitaire : %.2f %s", unitPriceDiff, currency)
    } else {
        totalPriceText = fmt.Sprintf("Prix total pour [%d] pièce(s) : %.2f", quantity, totalPrice)
        unitPriceText = fmt.Sprintf("Prix unitaire : %.2f", unitPrice)
        unitPriceDiffText = fmt.Sprintf("Différence de prix unitaire : %.2f", unitPriceDiff)
    }

    label := createLabel(totalPriceText)
    box.PackStart(label, false, false, 0)
    emptyLine := createLabel("")
    box.PackStart(emptyLine, true, true, 0)
    label2 := createLabel(unitPriceText)
    box.PackStart(label2, false, false, 0)
    emptyLine2 := createLabel("")
    box.PackStart(emptyLine2, true, true, 0)
    label3 := createLabel(unitPriceDiffText)
    box.PackStart(label3, false, false, 0)
    emptyLine3 := createLabel("")
    box.PackStart(emptyLine3, true, true, 0)
    // Création et ajout d'un bouton.
    button := createButton("OK")
    button.Connect("clicked", func() {
        priceWin.Destroy()
    })
    box.PackStart(button, false, false, 0)
    priceWin.ShowAll()
}
