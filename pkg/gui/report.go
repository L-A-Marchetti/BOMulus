package gui

import (
	"config"
	"core"
	"fmt"
	"report"

	"github.com/gotk3/gotk3/gtk"
)

// Function to open the report window
func ShowReport() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.ShowReport()", true).Stop()
	}
	// Calling Report functions.
	oosComponents, oosCompIdx := report.OutOfStockComp()
	riskylssComponents, riskylssCompIdx := report.RiskyLSSComp()
	manufacturerMessages, manufacturerMsgCompIdx := report.ManufacturerMessages()
	minPrice, maxPrice, minPriceDiff, maxPriceDiff := report.MinMaxPrice()
	mismatchComponents := report.MismatchMpn()
	mismatchCompDescription, mismatchCompDesIdx := report.MismatchDescription()
	// Create a new window for showing the report.
	reportWindow := createWindow("Analysis Report", 300, 900)
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
	mismatchingDescriptions := core.ReportGrid{
		ExpanderName: "Mismatching Descriptions ⚐ " + fmt.Sprintf("%d", len(mismatchCompDescription)),
		Headers:      []string{"Line", "Quantity", "Manufacturer Part Number", "User Description", "Supplier Description", config.INFO_BTN_CHAR},
		RowsAttributes: []core.ComponentMethod{
			func(c *core.Component) string { return fmt.Sprintf("%d", c.NewRow) },
			func(c *core.Component) string { return fmt.Sprintf("%d", c.Quantity) },
			func(c *core.Component) string { return c.Mpn },
			func(c *core.Component) string { return c.UserDescription },
			func(c *core.Component) string { return c.SupplierDescription }},
		Components: mismatchCompDescription,
		ButtonIdx:  mismatchCompDesIdx,
	}
	createGridSection(mismatchingDescriptions, vbox)
	//			︵‿︵‿︵‿︵‿︵PRICE︵‿︵‿︵‿︵‿︵
	priceExpander, _ := gtk.ExpanderNew("Price")
	priceBox := createBox(gtk.ORIENTATION_VERTICAL, 0)
	priceEntry := createEntry()
	priceEntry.SetText("Enter a quantity.")
	priceButton := createButton("Calculate")
	priceButton.Connect("clicked", func() {
		quantity, err := priceEntry.GetText()
		core.ErrorsHandler(err)
		priceCalculation(quantity, reportWindow)
	})
	minMaxPriceLabel := createLabel("Min:\t" + fmt.Sprintf("%.4f", minPrice) + "€\t\tΔ:\t" + fmt.Sprintf("%.4f", minPriceDiff) + "€\t\tMax:\t" + fmt.Sprintf("%.4f", maxPrice) + "€\t\tΔ:\t" + fmt.Sprintf("%.4f", maxPriceDiff) + "€")
	emptyLine := createLabel("")
	priceBox.PackStart(emptyLine, true, true, 1)
	priceBox.PackStart(priceEntry, false, false, 0)
	priceBox.PackStart(priceButton, false, false, 0)
	emptyLine2 := createLabel("")
	priceBox.PackStart(emptyLine2, true, true, 1)
	priceBox.PackStart(minMaxPriceLabel, false, false, 0)
	priceExpander.Add(priceBox)
	vbox.PackStart(priceExpander, false, false, 0)
	//			╔ ————————————————————————————————————————————— ╗
	//						  ORDERING/MANUFACTURING
	//			╚ ————————————————————————————————————————————— ╝
	manufacturingLabel := createLabel("---------- Ordering/Manufacturing ----------")
	vbox.PackStart(manufacturingLabel, false, false, 0)
	//			︵‿︵‿︵‿︵‿︵OUT OF STOCK COMPONENTS︵‿︵‿︵‿︵‿︵
	outOfStockComponents := core.ReportGrid{
		ExpanderName: "Out of Stock Components ⚐ " + fmt.Sprintf("%d", len(oosComponents)),
		Headers:      []string{"Line", "Quantity", "Manufacturer Part Number", config.INFO_BTN_CHAR},
		RowsAttributes: []core.ComponentMethod{
			func(c *core.Component) string { return fmt.Sprintf("%d", c.NewRow) },
			func(c *core.Component) string { return fmt.Sprintf("%d", c.Quantity) },
			func(c *core.Component) string { return c.Mpn }},
		Components: oosComponents,
		ButtonIdx:  oosCompIdx,
	}
	createGridSection(outOfStockComponents, vbox)
	//			︵‿︵‿︵‿︵‿︵RISKY LIFE CYCLE STATUS COMPONENTS︵‿︵‿︵‿︵‿︵
	riskyLifeCycleComponents := core.ReportGrid{
		ExpanderName: "Risky Life Cycle Status Components ⚐ " + fmt.Sprintf("%d", len(riskylssComponents)),
		Headers:      []string{"Line", "Quantity", "Manufacturer Part Number", "Life Cycle Status", config.INFO_BTN_CHAR},
		RowsAttributes: []core.ComponentMethod{
			func(c *core.Component) string { return fmt.Sprintf("%d", c.NewRow) },
			func(c *core.Component) string { return fmt.Sprintf("%d", c.Quantity) },
			func(c *core.Component) string { return c.Mpn },
			func(c *core.Component) string { return c.LifecycleStatus }},
		Components: riskylssComponents,
		ButtonIdx:  riskylssCompIdx,
	}
	createGridSection(riskyLifeCycleComponents, vbox)
	//			︵‿︵‿︵‿︵‿︵MANUFACTURER MESSAGES︵‿︵‿︵‿︵‿︵
	manufacturerMessagesComponents := core.ReportGrid{
		ExpanderName: "Manufacturer Messages ⚐ " + fmt.Sprintf("%d", len(manufacturerMessages)),
		Headers:      []string{"Line", "Quantity", "Manufacturer Part Number", "Messages", config.INFO_BTN_CHAR},
		RowsAttributes: []core.ComponentMethod{
			func(c *core.Component) string { return fmt.Sprintf("%d", c.NewRow) },
			func(c *core.Component) string { return fmt.Sprintf("%d", c.Quantity) },
			func(c *core.Component) string { return c.Mpn }},
		Components:         manufacturerMessages,
		ButtonIdx:          manufacturerMsgCompIdx,
		AttachmentsIterMsg: func(c *core.Component) []string { return c.InfoMessages },
		Attachments: []core.Attachment{
			{
				AttributeMsg: func(s string) string { return s },
				Column:       3,
			},
		},
		Jump: 1,
		Msg:  true,
	}
	createGridSection(manufacturerMessagesComponents, vbox)
	//			╔ ————————————————————————————————————————————— ╗
	//							   SUGGESTIONS
	//			╚ ————————————————————————————————————————————— ╝
	suggestionsLabel := createLabel("---------- Suggestions ----------")
	vbox.PackStart(suggestionsLabel, false, false, 0)
	voidBox := createBox(gtk.ORIENTATION_VERTICAL, 0)
	vbox.PackStart(voidBox, true, true, 0)
	// Create the "OK" button
	okButton := createButton("OK")
	vbox.PackStart(okButton, false, false, 0)
	// Connect the "OK" button to the export function
	okButton.Connect("clicked", func() {
		reportWindow.Destroy() // Close the window after exporting
	})
	reportWindow.ShowAll() // Show all elements in the window
}
