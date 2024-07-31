package gui

import (
	"config"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/gtk"
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
