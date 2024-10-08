package gui

import (
	"config"
	"core"
	"fmt"
	"os"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"github.com/gotk3/gotk3/pango"
)

func createWindow(title string, width, height int) *gtk.Window {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createWindow() ("+title+")", false).Stop()
	}
	// Create a new top-level window.
	win, err := gtk.WindowNew(gtk.WINDOW_TOPLEVEL)
	core.ErrorsHandler(err)
	// Set the title of the window.
	win.SetTitle(title)
	// Set the default size of the window.
	win.SetDefaultSize(width, height)
	return win
}

func setWindowIcon(win *gtk.Window) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.setWindowIcon()", false).Stop()
	}
	if _, err := os.Stat(config.LOGO_PATH); err == nil {
		win.SetIconFromFile(config.LOGO_PATH)
	}
}

func createLabel(s string) *gtk.Label {
	label, err := gtk.LabelNew(s)
	core.ErrorsHandler(err)
	return label
}

func createBox(orientation gtk.Orientation, spacing int) *gtk.Box {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createBox()", false).Stop()
	}
	box, err := gtk.BoxNew(orientation, spacing)
	core.ErrorsHandler(err)
	return box
}

func createButton(s string) *gtk.Button {
	button, err := gtk.ButtonNewWithLabel(s)
	core.ErrorsHandler(err)
	return button
}

func createButtonWithIcon(labelText, iconName string) *gtk.Button {
	// Create a horizontal box to hold both the text label and the icon
	hBox, _ := gtk.BoxNew(gtk.ORIENTATION_HORIZONTAL, 5)

	// Create a label with the provided text
	label, _ := gtk.LabelNew(labelText)

	// Create an image widget using a GTK icon name (icon for "external link")
	icon, _ := gtk.ImageNewFromIconName(iconName, gtk.ICON_SIZE_BUTTON)

	// Pack the label and icon into the horizontal box
	hBox.PackStart(label, true, true, 0) // Add label on the left
	hBox.PackEnd(icon, false, false, 0)  // Add icon on the right

	// Create a button and add the horizontal box to it
	button, _ := gtk.ButtonNew()
	button.Add(hBox)

	return button
}

func createProgressBar() *gtk.ProgressBar {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createProgressBar()", false).Stop()
	}
	progressBar, err := gtk.ProgressBarNew()
	core.ErrorsHandler(err)
	progressBar.SetShowText(true)
	progressBar.SetFraction(core.AnalysisState.Progress)
	progressBar.SetText(fmt.Sprintf("%d / %d", core.AnalysisState.Current, core.AnalysisState.Total))
	progressBar.SetSizeRequest(20, -1)
	// Update periodically the progressbar.
	glib.TimeoutAdd(100, func() bool {
		progressBar.SetFraction(core.AnalysisState.Progress)
		progressBar.SetText(fmt.Sprintf("%d / %d", core.AnalysisState.Current, core.AnalysisState.Total))
		return core.AnalysisState.InProgress
	})
	return progressBar
}

func createCommonScrolledWindow() *gtk.ScrolledWindow {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createCommonScrolledWindow()", false).Stop()
	}
	scrolledWindow, err := gtk.ScrolledWindowNew(nil, nil)
	core.ErrorsHandler(err)
	scrolledWindow.SetPolicy(gtk.POLICY_NEVER, gtk.POLICY_AUTOMATIC)
	return scrolledWindow
}

func addBoxMargin(box *gtk.Box) {
	box.SetMarginBottom(20)
	box.SetMarginTop(20)
	box.SetMarginStart(20)
	box.SetMarginEnd(20)
}

func componentLabels(idx int, box *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.componentLabels()", true).Stop()
	}
	availability := core.Components[idx].Availability
	if availability == "" {
		availability = "Out of stock"
	}
	status := core.Components[idx].LifecycleStatus
	if status == "" {
		status = "Active"
	}
	componentInfosGrid([]string{
		"Manufacturer Part Number", core.Components[idx].Mpn,
		"Manufacturer", core.Components[idx].SupplierManufacturer,
		"Supplier Descrition", core.Components[idx].SupplierDescription,
		"Category", core.Components[idx].Category,
		"Availability", availability,
		"Lifecycle Status", status,
		"ROHS", core.Components[idx].ROHSStatus,
		"Suggested Replacement", core.Components[idx].SuggestedReplacement},
		box)
}

func componentInfosGrid(infos []string, box *gtk.Box) {
	grid := createGrid()
	for i := 0; i+1 < len(infos); i += 2 {
		if infos[i+1] == "" {
			continue
		}
		label1 := createLabel(infos[i])
		label1.SetHAlign(gtk.ALIGN_START)
		label2 := createLabel(":")
		label3 := createLabel(infos[i+1])
		label3.SetHAlign(gtk.ALIGN_START)
		grid.Attach(label1, 0, i/2, 1, 1)
		grid.Attach(label2, 1, i/2, 1, 1)
		grid.Attach(label3, 2, i/2, 1, 1)
	}
	centerBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	centerBox.PackStart(grid, true, false, 0)
	box.PackStart(centerBox, false, false, 0)
}

func componentPricesGrid(idx int, box *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.componentPricesGrid()", true).Stop()
	}
	grid := createGrid()
	// Grid headers (quantities).
	quantityHeader := createLabel("Quantity")
	quantityHeader.SetHAlign(gtk.ALIGN_START)
	grid.Attach(quantityHeader, 1, 0, 1, 1)
	for i, pb := range core.Components[idx].PriceBreaks {
		if i == 0 {
			grid.Attach(createLabel("│"), i*3+3, 0, 1, 1)
		}
		quantityHeader := createLabel(fmt.Sprintf("%d", pb.Quantity))
		grid.Attach(quantityHeader, i*3+4, 0, 1, 1)
		grid.Attach(createLabel("│"), i*3+5, 0, 1, 1)
	}
	// Price row.
	priceHeader := createLabel("Price")
	priceHeader.SetHAlign(gtk.ALIGN_START)
	grid.Attach(priceHeader, 1, 1, 1, 1)
	// Append prices to the grid.
	for i, pb := range core.Components[idx].PriceBreaks {
		if i == 0 {
			grid.Attach(createLabel("│"), i*3+3, 1, 1, 1)
		}
		priceLabel := createLabel(pb.Price)
		grid.Attach(priceLabel, i*3+4, 1, 1, 1)
		grid.Attach(createLabel("│"), i*3+5, 1, 1, 1)
	}
	centerBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	centerBox.PackStart(grid, true, false, 0)
	box.PackStart(centerBox, false, false, 0)
}

func createEntry() *gtk.Entry {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createEntry()", false).Stop()
	}
	entry, err := gtk.EntryNew()
	core.ErrorsHandler(err)
	return entry
}

// Function to show a message dialog
func showMessageDialog(parent *gtk.Window, title string, message string) {
	msgDialog := gtk.MessageDialogNew(parent,
		gtk.DIALOG_MODAL,
		gtk.MESSAGE_INFO,
		gtk.BUTTONS_OK,
		message)
	msgDialog.SetTitle(title)
	msgDialog.Run()     // Show the dialog
	msgDialog.Destroy() // Destroy the dialog after use
}

func createGrid() *gtk.Grid {
	grid, err := gtk.GridNew()
	core.ErrorsHandler(err)
	grid.SetColumnSpacing(10)
	grid.SetRowSpacing(5)
	return grid
}

func createTightGrid() *gtk.Grid {
	grid, err := gtk.GridNew()
	core.ErrorsHandler(err)
	grid.SetColumnSpacing(0)
	grid.SetRowSpacing(5)
	return grid
}

func createGridHeaders(headers []string, grid *gtk.Grid) {
	for i, header := range headers {
		headerLabel := createLabel(header)
		grid.Attach(headerLabel, i, 0, 1, 1)
	}
}

func createGridSection(reportGrid core.ReportGrid, parentBox *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createGridSection()", true).Stop()
	}
	expander, _ := gtk.ExpanderNew(reportGrid.ExpanderName)
	grid := createGrid()
	createGridHeaders(reportGrid.Headers, grid)
	rowCount := 0
	for i, component := range reportGrid.Components {
		for k, method := range reportGrid.RowsAttributes {
			label := createLabel(method(&component))
			wrapText(label, 40)
			grid.Attach(label, k, i+1+rowCount, 1, 1)
		}
		if len(reportGrid.ButtonIdx) != 0 {
			button := createButton(config.INFO_BTN_CHAR)
			button.Connect("clicked", func() {
				ShowComponent(reportGrid.ButtonIdx[i])
			})
			grid.Attach(button, len(reportGrid.RowsAttributes), i+1+rowCount, 1, 1)
		}
		if len(reportGrid.Attachments) != 0 {
			if reportGrid.Msg {
				for j, iter := range reportGrid.AttachmentsIterMsg(&component) {
					for _, attachment := range reportGrid.Attachments {
						label := createLabel(attachment.AttributeMsg(iter))
						wrapText(label, 40)
						grid.Attach(label, attachment.Column, i+reportGrid.Jump+j+rowCount, 1, 1)
					}
				}
				rowCount += len(reportGrid.AttachmentsIterMsg(&component)) - 1
			} else {
				for j, iter := range reportGrid.AttachmentsIter(&component) {
					for _, attachment := range reportGrid.Attachments {
						label := createLabel(attachment.Attribute(&iter))
						wrapText(label, 40)
						grid.Attach(label, attachment.Column, i+reportGrid.Jump+j+rowCount, 1, 1)
					}
				}
				rowCount += len(reportGrid.AttachmentsIter(&component))
			}
		}
	}
	centerBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	addBoxMargin(centerBox)
	centerBox.PackStart(grid, true, false, 0)
	expander.Add(centerBox)
	parentBox.PackStart(expander, false, false, 0)
}

func wrapText(label *gtk.Label, max int) {
	label.SetLineWrap(true)
	label.SetLineWrapMode(pango.WRAP_WORD_CHAR)
	label.SetMaxWidthChars(max)
}

func createComboBoxes(box *gtk.Box) {
	startCombo, err := gtk.ComboBoxTextNew()
	core.ErrorsHandler(err)
	startCombo.PrependText("Analysis Starting Point")
	for i, component := range core.Components {
		quantity := 0
		if component.Operator == "UPDATE" {
			quantity = component.NewQuantity
		} else {
			quantity = component.Quantity
		}
		text := fmt.Sprintf("[%d] ", i+1)
		text += fmt.Sprintf(" ∑%d  (%s)", quantity, component.Mpn)
		startCombo.AppendText(text)
	}
	startCombo.SetActive(0)
	box.PackStart(startCombo, false, false, 0)
	startCombo.Connect("changed", func() {
		core.AnalysisState.IdxStart = startCombo.GetActive() - 1
	})
	endCombo, err := gtk.ComboBoxTextNew()
	core.ErrorsHandler(err)
	endCombo.PrependText("Analysis End Point")
	for i, component := range core.Components {
		quantity := 0
		if component.Operator == "UPDATE" {
			quantity = component.NewQuantity
		} else {
			quantity = component.Quantity
		}
		text := fmt.Sprintf("[%d] ", i+1)
		text += fmt.Sprintf(" ∑%d  (%s)", quantity, component.Mpn)
		endCombo.AppendText(text)
	}
	endCombo.SetActive(0)
	box.PackStart(endCombo, false, false, 0)
	endCombo.Connect("changed", func() {
		core.AnalysisState.IdxEnd = endCombo.GetActive() - 1
	})
}

func applyCSS(widget *gtk.Grid, css string) {
	cssProvider, _ := gtk.CssProviderNew()
	screen, _ := gdk.ScreenGetDefault()
	cssProvider.LoadFromData(css)
	// Apply the CSS to the screen
	gtk.AddProviderForScreen(screen, cssProvider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)
	// Set the CSS name of the widget
	widget.SetName("grid")
}

func stylize(widget gtk.IWidget, cssContent string, cssClassName string) {
	cssProvider, _ := gtk.CssProviderNew()
	screen, _ := gdk.ScreenGetDefault()

	// Load css from string
	err := cssProvider.LoadFromData(cssContent)
	if err != nil {
		fmt.Println("Erreur lors du chargement du CSS :", err)
	}

	// Add CSS
	gtk.AddProviderForScreen(screen, cssProvider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)

	// Assign CSS class to widget
	widget.ToWidget().SetName(cssClassName)
}
