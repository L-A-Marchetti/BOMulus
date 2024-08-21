package gui

import (
	"config"
	"fmt"
	"log"
	"report"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the report window
func ShowReport() {
	// Prototyping Report functions.
	oosComponents, oosCompIdx := report.OutOfStockComp()
	riskylssComponents, riskylssCompIdx := report.RiskyLSSComp()
	manufacturerMessages, manufacturerMsgCompIdx := report.ManufacturerMessages()
	minPrice, maxPrice := report.MinMaxPrice()
	// Create a new window for showing the report.
	reportWindow, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	if err != nil {
		log.Fatal(err)
	}
	reportWindow.SetTitle("Analysis Report")
	reportWindow.SetDefaultSize(300, 200)
	// Create a vertical box container for the window
	vbox, err := gtk.BoxNew(gtk.ORIENTATION_VERTICAL, 10)
	if err != nil {
		log.Fatal(err)
	}
	vbox.SetMarginBottom(20)
	vbox.SetMarginTop(20)
	vbox.SetMarginStart(20)
	vbox.SetMarginEnd(20)
	reportWindow.Add(vbox)
	// Create labels to categorize infos.
	infosLabel, err := gtk.LabelNew("---------- Infos Summary ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(infosLabel, false, false, 0)
	priceLabel, err := gtk.LabelNew("---------- Price ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(priceLabel, false, false, 0)
	minMaxPriceLabel, err := gtk.LabelNew("Min:\t" + fmt.Sprintf("%.4f", minPrice) + "€\t\tMax:\t" + fmt.Sprintf("%.4f", maxPrice) + "€")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(minMaxPriceLabel, false, false, 0)
	manufacturingLabel, err := gtk.LabelNew("---------- Ordering/Manufacturing ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(manufacturingLabel, false, false, 0)
	oosLabel, err := gtk.LabelNew("---------- Out of Stock components ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(oosLabel, false, false, 0)
	// Create a grid for Out of Stock components.
	oosGrid, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	oosGrid.SetColumnSpacing(10)
	oosGrid.SetRowSpacing(5)
	// oosGrid headers.
	lineHeader, _ := gtk.LabelNew("Line")
	quantityHeader, _ := gtk.LabelNew("Quantity")
	mpnHeader, _ := gtk.LabelNew("Manufacturer Part Number")
	moreHeader, _ := gtk.LabelNew(config.INFO_BTN_CHAR)
	oosGrid.Attach(lineHeader, 0, 0, 1, 1)
	oosGrid.Attach(quantityHeader, 1, 0, 1, 1)
	oosGrid.Attach(mpnHeader, 2, 0, 1, 1)
	oosGrid.Attach(moreHeader, 3, 0, 1, 1)
	// Append oos components to the oosGrid.
	for i, oosComponent := range oosComponents {
		lineLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", oosComponent.NewRow))
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", oosComponent.Quantity))
		mpnLabel, _ := gtk.LabelNew(oosComponent.Mpn)
		moreButton, err := gtk.ButtonNewWithLabel(config.INFO_BTN_CHAR)
		if err != nil {
			log.Fatal(err)
		}
		moreButton.Connect("clicked", func() {
			ShowComponent(oosCompIdx[i], -1, false)
		})
		oosGrid.Attach(lineLabel, 0, i+1, 1, 1)
		oosGrid.Attach(quantityLabel, 1, i+1, 1, 1)
		oosGrid.Attach(mpnLabel, 2, i+1, 1, 1)
		oosGrid.Attach(moreButton, 3, i+1, 1, 1)
	}
	centerBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	centerBox.PackStart(oosGrid, true, false, 0)
	vbox.PackStart(centerBox, false, false, 0)
	riskylssLabel, err := gtk.LabelNew("---------- Risky Life Cycle Status components ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(riskylssLabel, false, false, 0)
	// Create a grid for risky life cycle status components.
	riskylssGris, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	riskylssGris.SetColumnSpacing(10)
	riskylssGris.SetRowSpacing(5)
	// riskylss grid headers.
	rlsslineHeader, _ := gtk.LabelNew("Line")
	rlssquantityHeader, _ := gtk.LabelNew("Quantity")
	rlssmpnHeader, _ := gtk.LabelNew("Manufacturer Part Number")
	rlssHeader, _ := gtk.LabelNew("Life Cycle Status")
	rlssmoreHeader, _ := gtk.LabelNew(config.INFO_BTN_CHAR)
	riskylssGris.Attach(rlsslineHeader, 0, 0, 1, 1)
	riskylssGris.Attach(rlssquantityHeader, 1, 0, 1, 1)
	riskylssGris.Attach(rlssmpnHeader, 2, 0, 1, 1)
	riskylssGris.Attach(rlssHeader, 3, 0, 1, 1)
	riskylssGris.Attach(rlssmoreHeader, 4, 0, 1, 1)
	// Append risky lss components to the riskylss grid.
	for i, rlssComponent := range riskylssComponents {
		lineLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", rlssComponent.NewRow))
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", rlssComponent.Quantity))
		mpnLabel, _ := gtk.LabelNew(rlssComponent.Mpn)
		lssLabel, _ := gtk.LabelNew(rlssComponent.LifecycleStatus)
		moreButton, err := gtk.ButtonNewWithLabel(config.INFO_BTN_CHAR)
		if err != nil {
			log.Fatal(err)
		}
		moreButton.Connect("clicked", func() {
			ShowComponent(riskylssCompIdx[i], -1, false)
		})
		riskylssGris.Attach(lineLabel, 0, i+1, 1, 1)
		riskylssGris.Attach(quantityLabel, 1, i+1, 1, 1)
		riskylssGris.Attach(mpnLabel, 2, i+1, 1, 1)
		riskylssGris.Attach(lssLabel, 3, i+1, 1, 1)
		riskylssGris.Attach(moreButton, 4, i+1, 1, 1)
	}
	rlsscenterBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	rlsscenterBox.PackStart(riskylssGris, true, false, 0)
	vbox.PackStart(rlsscenterBox, false, false, 0)
	mMsgsLabel, err := gtk.LabelNew("---------- Manufacturer Messages ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(mMsgsLabel, false, false, 0)
	// Create a grid for Manufacturer components.
	mMsgsGrid, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	mMsgsGrid.SetColumnSpacing(10)
	mMsgsGrid.SetRowSpacing(5)
	// mMsgsGrid headers.
	mMsgslineHeader, _ := gtk.LabelNew("Line")
	mMsgsquantityHeader, _ := gtk.LabelNew("Quantity")
	mMsgsmpnHeader, _ := gtk.LabelNew("Manufacturer Part Number")
	mMsgsmoreHeader, _ := gtk.LabelNew(config.INFO_BTN_CHAR)
	mMsgsHeader, _ := gtk.LabelNew("Messages")
	mMsgsGrid.Attach(mMsgslineHeader, 0, 0, 1, 1)
	mMsgsGrid.Attach(mMsgsquantityHeader, 1, 0, 1, 1)
	mMsgsGrid.Attach(mMsgsmpnHeader, 2, 0, 1, 1)
	mMsgsGrid.Attach(mMsgsmoreHeader, 3, 0, 1, 1)
	mMsgsGrid.Attach(mMsgsHeader, 4, 0, 1, 1)
	// Append components to the mMsgsGrid.
	for i, mMsgComponent := range manufacturerMessages {
		rowCount := 0
		lineLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", mMsgComponent.NewRow))
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", mMsgComponent.Quantity))
		mpnLabel, _ := gtk.LabelNew(mMsgComponent.Mpn)
		moreButton, err := gtk.ButtonNewWithLabel(config.INFO_BTN_CHAR)
		if err != nil {
			log.Fatal(err)
		}
		moreButton.Connect("clicked", func() {
			ShowComponent(manufacturerMsgCompIdx[i], -1, false)
		})
		mMsgsGrid.Attach(lineLabel, 0, i+1+rowCount, 1, 1)
		mMsgsGrid.Attach(quantityLabel, 1, i+1+rowCount, 1, 1)
		mMsgsGrid.Attach(mpnLabel, 2, i+1+rowCount, 1, 1)
		mMsgsGrid.Attach(moreButton, 3, i+1+rowCount, 1, 1)
		for j, mMsg := range mMsgComponent.InfoMessages {
			msgLabel, _ := gtk.LabelNew(mMsg)
			mMsgsGrid.Attach(msgLabel, 4, i+1+j+rowCount, 1, 1)
		}
		rowCount += len(mMsgComponent.InfoMessages) - 1
	}
	mMsgsCenterBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	mMsgsCenterBox.PackStart(mMsgsGrid, true, false, 0)
	vbox.PackStart(mMsgsCenterBox, false, false, 0)
	suggestionsLabel, err := gtk.LabelNew("---------- Suggestions ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(suggestionsLabel, false, false, 0)
	// Create the "OK" button
	okButton, err := gtk.ButtonNewWithLabel("OK")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(okButton, false, false, 0)
	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		reportWindow.Destroy() // Close the window after exporting
	})
	reportWindow.ShowAll() // Show all elements in the window
}
