package gui

import (
	"config"
	"fmt"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
	"github.com/gotk3/gotk3/pango"
)

func Stylize(widget *gtk.Box) {
	cssProvider, _ := gtk.CssProviderNew()
	screen, _ := gdk.ScreenGetDefault()
	cssProvider.LoadFromData(config.BOXES_CSS)
	// Apply the CSS to the screen
	gtk.AddProviderForScreen(screen, cssProvider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)
	// Set the CSS name of the widget
	widget.SetName(config.BOXES_CLASS_NAME)
}

// Apply css to enlarge scrollbars.
func EnlargeSb() {
	provider, err := gtk.CssProviderNew()
	if err != nil {
		panic(err)
	}
	err = provider.LoadFromData(config.SCROLLBAR_CSS)
	if err != nil {
		panic(err)
	}
	screen, err := gdk.ScreenGetDefault()
	if err != nil {
		panic(err)
	}
	gtk.AddProviderForScreen(screen, provider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)
}

// Render and setup cells.
func CellsProperties() *gtk.CellRendererText {
	cellRenderer, err := gtk.CellRendererTextNew()
	if err != nil {
		panic(err)
	}
	cellRenderer.SetProperty("editable", true)
	cellRenderer.Set("font", config.OUTPUT_FONT)
	cellRenderer.Set("wrap-mode", pango.WRAP_WORD_CHAR)
	cellRenderer.Set("wrap-width", config.WRAP_WIDTH)
	return cellRenderer
}

// Render and setup columns.
func ColumnProperties(title string, maxColumns, i int, cellRenderer *gtk.CellRendererText) *gtk.TreeViewColumn {
	column, err := gtk.TreeViewColumnNewWithAttribute(title, cellRenderer, "text", i)
	if err != nil {
		panic(err)
	}
	fmt.Println(i, maxColumns+3+i)
	column.AddAttribute(cellRenderer, "background", maxColumns+3+i) // Index of the background color column
	column.SetMinWidth(config.CELLS_MIN_WIDTH)
	column.SetResizable(true)
	column.SetExpand(true)
	return column
}
