package gui

import (
	"config"
	"core"
	"fmt"
	"math"
	"path/filepath"
	"strings"
	"time"

	"github.com/gotk3/gotk3/gdk"
	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

func SetupDragAndDrop(widget *gtk.Box, boxIdx int, label *gtk.Label, button *gtk.Button) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.SetupDragAndDrop()", false).Stop()
	}
	// Create a target entry for file URIs.
	targetEntry, _ := gtk.TargetEntryNew("text/uri-list", gtk.TARGET_OTHER_APP, 0)
	// Enable drag-and-drop for the widget.
	widget.DragDestSet(gtk.DEST_DEFAULT_ALL, []gtk.TargetEntry{*targetEntry}, gdk.ACTION_COPY)
	// Connect the "drag-data-received" signal to a callback function.
	widget.Connect("drag-data-received", func(widget *gtk.Box, context *gdk.DragContext, x, y int, selectionData *gtk.SelectionData, info uint, time uint32) {
		data := selectionData.GetData()
		uris := strings.Split(string(data), "\n")
		if len(uris) > 0 && uris[0] != "" {
			// Remove the "file://" prefix and any trailing whitespace
			filename := strings.TrimSpace(strings.TrimPrefix(uris[0], config.FILE_PREFIX))
			// Check if the file has valid extension
			if core.HasValidExtension(filename) {

				startPulsatingAnimation(widget.ToWidget())

				// Loading simulation animation
				glib.TimeoutAdd(1000, func() bool {
					// Stop animation
					stopPulsatingAnimation(widget.ToWidget())

					// Add green icon to say valid
					label.SetMarkup(fmt.Sprintf("<span foreground='green'>✓</span> %s", filepath.Base(filename)))

					// Update filesnames
					switch boxIdx {
					case 1:
						core.XlsmFiles[0].Path = filename
					case 2:
						core.XlsmFiles[1].Path = filename
					}

					// Reinit label
					button.SetLabel(config.INIT_BUTTON_LABEL)
					return false
				})
			} else {
				label.SetMarkup(fmt.Sprintf("<span foreground='red'>✗</span> %s", config.WRONG_EXT_MSG))
			}
		}
	})
}

var animationID int

func startPulsatingAnimation(widget *gtk.Widget) {
	origWidth, origHeight := widget.GetSizeRequest()
	startTime := time.Now()
	animationDuration := time.Millisecond * 1000 // 1s animation

	animationID = widget.AddTickCallback(func(widget *gtk.Widget, frameClock *gdk.FrameClock) bool {
		elapsed := time.Since(startTime)
		if elapsed > animationDuration {
			widget.SetSizeRequest(origWidth, origHeight)
			widget.SetOpacity(1.0)
			animationID = 0
			return false // Stop animation
		}

		progress := float64(elapsed) / float64(animationDuration)
		scale := 1.0 + 0.1*math.Sin(progress*math.Pi*2)
		opacity := 0.5 + 0.5*math.Sin(progress*math.Pi*2)

		widget.SetOpacity(opacity)
		widget.SetSizeRequest(int(float64(origWidth)*scale), int(float64(origHeight)*scale))
		return true
	})
}

func stopPulsatingAnimation(widget *gtk.Widget) {
	if animationID != 0 {
		widget.RemoveTickCallback(animationID)
		animationID = 0
	}
	widget.SetOpacity(1.0)
	origWidth, origHeight := widget.GetSizeRequest()
	widget.SetSizeRequest(origWidth, origHeight)
}

func createDragAndDropBoxes(button *gtk.Button) *gtk.Box {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createDragAndDropBoxes()", true).Stop()
	}
	// Create labels for boxes.
	label1, label2 := createLabel(config.INIT_BOX1_MSG), createLabel(config.INIT_BOX2_MSG)

	// Configure labels
	for _, label := range []*gtk.Label{label1, label2} {
		label.SetJustify(gtk.JUSTIFY_CENTER)
		label.SetHAlign(gtk.ALIGN_CENTER)
		label.SetVAlign(gtk.ALIGN_CENTER)
		label.SetLineWrap(true)
		label.SetVExpand(true)
		label.SetHExpand(true)
	}
	// Create the depot boxes.
	box1, box2 := createBox(gtk.ORIENTATION_VERTICAL, 6), createBox(gtk.ORIENTATION_VERTICAL, 6)
	box1.SetVExpand(true)
	box2.SetVExpand(true)
	box1.SetHExpand(true)
	box2.SetHExpand(true)

	// Add labels to boxes.
	box1.Add(label1)
	box2.Add(label2)
	// Create a horizontal box container to hold both boxes side by side.
	hBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
	hBox.SetVExpand(true)
	hBox.SetHExpand(true)

	separator, _ := gtk.SeparatorNew(gtk.ORIENTATION_VERTICAL)
	separator.SetVExpand(true) // S'assurer qu'il s'étend verticalement

	// Add both boxes to the horizontal box container.
	hBox.PackStart(box1, true, true, 0)
	hBox.PackStart(separator, false, false, 0) // Séparateur au milieu
	hBox.PackStart(box2, true, true, 0)
	// Apply style to the boxes.
	//stylize(box1)
	//stylize(box2)
	// Set up drag and drop functionality for both boxes.
	SetupDragAndDrop(box1, 1, label1, button)
	SetupDragAndDrop(box2, 2, label2, button)

	return hBox
}
