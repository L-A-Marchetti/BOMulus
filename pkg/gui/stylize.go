package gui

import (
	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
)

func Stylize(widget *gtk.Box) {
	cssProvider, _ := gtk.CssProviderNew()
	screen, _ := gdk.ScreenGetDefault()
	// Load CSS
	css := `
	#box {
		border: 1px dotted black;
		border-radius: 5px;
		padding: 30px;
		margin: 30px;
	}
	`
	cssProvider.LoadFromData(css)
	// Apply the CSS to the screen
	gtk.AddProviderForScreen(screen, cssProvider, gtk.STYLE_PROVIDER_PRIORITY_APPLICATION)
	// Set the CSS name of the widget
	widget.SetName("box")
}
