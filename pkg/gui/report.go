package gui

import (
	"config"
	"core"
	"fmt"
	"log"
	"report"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the report window
func ShowReport() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.ShowReport()", true).Stop()
	}
	// Prototyping Report functions.
	oosComponents, oosCompIdx := report.OutOfStockComp()
	riskylssComponents, riskylssCompIdx := report.RiskyLSSComp()
	manufacturerMessages, manufacturerMsgCompIdx := report.ManufacturerMessages()
	minPrice, maxPrice, minPriceDiff, maxPriceDiff := report.MinMaxPrice()
	mismatchComponents := report.MismatchMpn()
	mismatchCompDescription, mismatchCompDesIdx := report.MismatchDescription()
	// Create a new window for showing the report.
	reportWindow := createWindow("Analysis Report", 1000, 900)
	// Create a ScrolledWindow
	scrolledWindow := createCommonScrolledWindow()
	// Create a vertical box container for the window
	vbox := createBox(gtk.ORIENTATION_VERTICAL, 10)
	addBoxMargin(vbox)
	scrolledWindow.Add(vbox)
	reportWindow.Add(scrolledWindow)
	//			╔ ————————————————————————————————————————————— ╗
	//							   INFOS SUMMARY
	//			╚ ————————————————————————————————————————————— ╝
	infosLabel := createLabel("---------- Infos Summary ----------")
	vbox.PackStart(infosLabel, false, false, 0)
	//			︵‿︵‿︵‿︵‿︵MISMATCHING MANUFACTURER PART NUMBER︵‿︵‿︵‿︵‿︵
	mismatchingMPN := core.ReportGrid{
		ExpanderName: "Mismatching Manufacturer Part Number ⚐ " + fmt.Sprintf("%d", len(mismatchComponents)),
		Headers:      []string{"Line", "Quantity", "Manufacturer Part Number", "Description"},
		RowsAttributes: []core.ComponentMethod{
			func(c *core.Component) string { return fmt.Sprintf("%d", c.NewRow) },
			func(c *core.Component) string { return fmt.Sprintf("%d", c.Quantity) },
			func(c *core.Component) string { return c.Mpn },
			func(c *core.Component) string { return c.UserDescription }},
		AttachmentsIter: func(c *core.Component) []core.Component { return c.MismatchMpn },
		Attachments: []core.Attachment{
			{
				Attribute: func(c *core.Component) string { return c.Mpn },
				Column:    2,
			},
			{
				Attribute: func(c *core.Component) string { return c.SupplierDescription },
				Column:    3,
			},
		},
		Jump:       2,
		Components: mismatchComponents,
	}
	createGridSection(mismatchingMPN, vbox)
	//			︵‿︵‿︵‿︵‿︵MISMATCHING DESCRIPTIONS︵‿︵‿︵‿︵‿︵
	mdLabel, err := gtk.LabelNew("---------- Mismatching Descriptions ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(mdLabel, false, false, 0)
	// Create a grid for mismatching descriptions.
	mdGrid, err := gtk.GridNew()
	if err != nil {
		log.Fatal(err)
	}
	mdGrid.SetColumnSpacing(10)
	mdGrid.SetRowSpacing(5)
	// mdGrid headers.
	mdlineHeader, _ := gtk.LabelNew("Line")
	mdquantityHeader, _ := gtk.LabelNew("Quantity")
	mdmpnHeader, _ := gtk.LabelNew("Manufacturer Part Number")
	mduserdesHeader, _ := gtk.LabelNew("User Description")
	mdsuppdesHeader, _ := gtk.LabelNew("Supplier Description")
	mdmoreHeader, _ := gtk.LabelNew(config.INFO_BTN_CHAR)
	mdGrid.Attach(mdlineHeader, 0, 0, 1, 1)
	mdGrid.Attach(mdquantityHeader, 1, 0, 1, 1)
	mdGrid.Attach(mdmpnHeader, 2, 0, 1, 1)
	mdGrid.Attach(mduserdesHeader, 3, 0, 1, 1)
	mdGrid.Attach(mdsuppdesHeader, 4, 0, 1, 1)
	mdGrid.Attach(mdmoreHeader, 5, 0, 1, 1)
	// Append mismatching descriptions to the mdGrid.
	for i, mismatchComDes := range mismatchCompDescription {
		lineLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", mismatchComDes.NewRow))
		quantityLabel, _ := gtk.LabelNew(fmt.Sprintf("%d", mismatchComDes.Quantity))
		mpnLabel, _ := gtk.LabelNew(mismatchComDes.Mpn)
		userdesLabel, _ := gtk.LabelNew(mismatchComDes.UserDescription)
		suppdesLabel, _ := gtk.LabelNew(mismatchComDes.SupplierDescription)
		moreButton, err := gtk.ButtonNewWithLabel(config.INFO_BTN_CHAR)
		if err != nil {
			log.Fatal(err)
		}
		moreButton.Connect("clicked", func() {
			ShowComponent(mismatchCompDesIdx[i], -1, false)
		})
		mdGrid.Attach(lineLabel, 0, i+1, 1, 1)
		mdGrid.Attach(quantityLabel, 1, i+1, 1, 1)
		mdGrid.Attach(mpnLabel, 2, i+1, 1, 1)
		mdGrid.Attach(userdesLabel, 3, i+1, 1, 1)
		mdGrid.Attach(suppdesLabel, 4, i+1, 1, 1)
		mdGrid.Attach(moreButton, 5, i+1, 1, 1)
	}
	mdcenterBox, err := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 0)
	if err != nil {
		log.Fatal(err)
	}
	mdcenterBox.PackStart(mdGrid, true, false, 0)
	vbox.PackStart(mdcenterBox, false, false, 0)
	priceLabel, err := gtk.LabelNew("---------- Price ----------")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(priceLabel, false, false, 0)
	minMaxPriceLabel, err := gtk.LabelNew("Min:\t" + fmt.Sprintf("%.4f", minPrice) + "€\t\tΔ:\t" + fmt.Sprintf("%.4f", minPriceDiff) + "€\t\tMax:\t" + fmt.Sprintf("%.4f", maxPrice) + "€\t\tΔ:\t" + fmt.Sprintf("%.4f", maxPriceDiff) + "€")
	if err != nil {
		log.Fatal(err)
	}
	vbox.PackStart(minMaxPriceLabel, false, false, 0)
	//			╔ ————————————————————————————————————————————— ╗
	//						  ORDERING/MANUFACTURING
	//			╚ ————————————————————————————————————————————— ╝
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
	rowCount := 0
	for i, mMsgComponent := range manufacturerMessages {
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
	//			╔ ————————————————————————————————————————————— ╗
	//							   SUGGESTIONS
	//			╚ ————————————————————————————————————————————— ╝
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
