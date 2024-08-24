package gui

import (
	"config"
	"core"
	"os"

	"github.com/gotk3/gotk3/gtk"
)

func createWindow(title string, width, height int) *gtk.Window {
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
	box, err := gtk.BoxNew(orientation, spacing)
	core.ErrorsHandler(err)
	return box
}

func createButton(s string) *gtk.Button {
	button, err := gtk.ButtonNewWithLabel(s)
	core.ErrorsHandler(err)
	return button
}
