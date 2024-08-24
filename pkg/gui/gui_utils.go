package gui

import (
	"config"
	"core"
	"os"

	"github.com/gotk3/gotk3/gtk"
)

func createWindow(title string, width, height int) *gtk.Window {
	if config.DEBUGGING {
		defer core.StartBenchmark("createWindow() ("+title+")", false).Stop()
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
		defer core.StartBenchmark("setWindowIcon()", false).Stop()
	}
	if _, err := os.Stat(config.LOGO_PATH); err == nil {
		win.SetIconFromFile(config.LOGO_PATH)
	}
}

func createLabel(s string) *gtk.Label {
	if config.DEBUGGING {
		defer core.StartBenchmark("createLabel() ("+s+")", false).Stop()
	}
	label, err := gtk.LabelNew(s)
	core.ErrorsHandler(err)
	return label
}

func createBox(orientation gtk.Orientation, spacing int) *gtk.Box {
	if config.DEBUGGING {
		defer core.StartBenchmark("createBox()", false).Stop()
	}
	box, err := gtk.BoxNew(orientation, spacing)
	core.ErrorsHandler(err)
	return box
}

func createButton(s string) *gtk.Button {
	if config.DEBUGGING {
		defer core.StartBenchmark("createButton() ("+s+")", false).Stop()
	}
	button, err := gtk.ButtonNewWithLabel(s)
	core.ErrorsHandler(err)
	return button
}
