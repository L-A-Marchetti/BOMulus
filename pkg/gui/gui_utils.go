package gui

import (
	"config"
	"core"
	"fmt"
	"os"

	"github.com/gotk3/gotk3/glib"
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

func createCheckBoxes(labels ...string) []*gtk.CheckButton {
	if config.DEBUGGING {
		defer core.StartBenchmark("createCheckBoxes()", false).Stop()
	}
	checkboxes := []*gtk.CheckButton{}
	for i, label := range labels {
		cb, err := gtk.CheckButtonNewWithLabel(label)
		core.ErrorsHandler(err)
		// Initialize checkboxes.
		cb = core.InitFilters(i, cb)
		checkboxes = append(checkboxes, cb)
		// Connect all checkboxes.
		cb.Connect("toggled", func() {
			// If a checkbox is toggled change the filters.
			core.SetFilters(checkboxes)
			UpdateView()
		})
	}
	return checkboxes
}

func createProgressBar() *gtk.ProgressBar {
	if config.DEBUGGING {
		defer core.StartBenchmark("createProgressBar()", false).Stop()
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
