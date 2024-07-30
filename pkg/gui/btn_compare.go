package gui

import (
	"core"
	"fmt"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
	"github.com/gotk3/gotk3/pango"
)

func BtnCompare(button *gtk.Button) {
	// Check if there's two files.
	if core.XlsmFiles[0].Path == "path/to/file1" || core.XlsmFiles[1].Path == "path/to/file2" {
		button.SetLabel("You need at least 2 files to compare...")
		return
	}
	// Read and store both Xlsm files.
	core.XlsmReader()
	// Generate delta data.
	core.XlsmDiff()
	// Determine the maximum number of columns.
	maxColumns := 0
	for _, file := range core.XlsmFiles {
		for _, row := range file.Content {
			if len(row) > maxColumns {
				maxColumns = len(row)
			}
		}
	}
	// Create a slice of types for the ListStore.
	columnTypes := make([]glib.Type, maxColumns+4) // +4 for Operation, OldRow, NewRow, and background color.
	for i := range columnTypes {
		columnTypes[i] = glib.TYPE_STRING
	}
	// Create the ListStore with the determined types.
	var err error
	resultStore, err = gtk.ListStoreNew(columnTypes...)
	if err != nil {
		panic(err)
	}
	resultView, err = gtk.TreeViewNewWithModel(resultStore)
	if err != nil {
		panic(err)
	}
	// Add columns to TreeView
	titles := append([]string{"Operation", "Old Row", "New Row"}, getColumnTitles(maxColumns)...)
	for i, title := range titles {
		cellRenderer, err := gtk.CellRendererTextNew()
		if err != nil {
			panic(err)
		}
		// Apply monospace font.
		cellRenderer.Set("font", "monospace 9")
		// Enable word wrap
		cellRenderer.Set("wrap-mode", pango.WRAP_WORD_CHAR)
		cellRenderer.Set("wrap-width", 400)

		column, err := gtk.TreeViewColumnNewWithAttribute(title, cellRenderer, "text", i)
		if err != nil {
			panic(err)
		}
		column.AddAttribute(cellRenderer, "background", maxColumns+3) // Index of the background color column
		// Determine a minimum cell size to avoid negative content width.
		column.SetMinWidth(20)
		// Make the column resizable
		column.SetResizable(true)
		// Set the column to expand to fill available space
		column.SetExpand(true)

		resultView.AppendColumn(column)
	}
	// Create a ScrolledWindow, add the TreeView to it, and then add the ScrolledWindow to vBox
	scrolledWindow, err := gtk.ScrolledWindowNew(nil, nil)
	if err != nil {
		panic(err)
	}
	scrolledWindow.SetPolicy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)
	scrolledWindow.Add(resultView)
	scrolledWindow.SetVExpand(true)
	scrolledWindow.SetHExpand(true)
	// Remove any existing TreeView from vBox and add the new one
	children := vBox.GetChildren()
	for l := children; l != nil; l = l.Next() {
		child := l.Data()
		if sw, ok := child.(*gtk.ScrolledWindow); ok {
			vBox.Remove(sw)
		}
	}
	vBox.PackStart(scrolledWindow, true, true, 0)
	vBox.ShowAll()
	// Fill the tree with deltas content.
	for _, row := range core.XlsmDeltas {
		var operation, oldRow, newRow, bgColor string
		var content []string
		switch row.Operator {
		case "EQUAL":
			operation = ""
			oldRow = fmt.Sprintf("%d", row.OldRow)
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = core.XlsmFiles[1].Content[row.NewRow]
			bgColor = ""
		case "INSERT":
			operation = "INSERT"
			oldRow = ""
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = core.XlsmFiles[1].Content[row.NewRow]
			bgColor = "#3cb257"
		case "DELETE":
			operation = "DELETE"
			oldRow = fmt.Sprintf("%d", row.OldRow)
			newRow = ""
			content = core.XlsmFiles[0].Content[row.OldRow]
			bgColor = "#b81717"
		case "UPDATE":
			// First row for the old.
			appendRow(resultStore, "", fmt.Sprintf("%d", row.OldRow), "", core.XlsmFiles[0].Content[row.OldRow], "#a9a528")
			// Second row for the new.
			operation = "UPDATE"
			oldRow = ""
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = core.XlsmFiles[1].Content[row.NewRow]
			bgColor = "#c2c045"
		}
		if bgColor != "" {
			appendRow(resultStore, operation, oldRow, newRow, content, bgColor)
		} else {
			appendRowWoBg(resultStore, operation, oldRow, newRow, content)
		}
	}
}

// Helper function to generate generic column titles.
func getColumnTitles(count int) []string {
	titles := make([]string, count)
	for i := 0; i < count; i++ {
		titles[i] = fmt.Sprintf("Column %d", i+1)
	}
	return titles
}

// Append row to the result store when there's an operator.
func appendRow(store *gtk.ListStore, operation, oldRow, newRow string, content []string, bgColor string) {
	iter := store.Append()
	values := make([]interface{}, len(content)+4)
	values[0] = operation
	values[1] = oldRow
	values[2] = newRow
	for i, v := range content {
		values[i+3] = v
	}
	values[len(values)-1] = bgColor

	err := store.Set(iter, makeRange(0, len(values)), values)
	if err != nil {
		panic(err)
	}
}

// Append row to the result store when there's no bg color.
func appendRowWoBg(store *gtk.ListStore, operation, oldRow, newRow string, content []string) {
	iter := store.Append()
	values := make([]interface{}, len(content)+3)
	values[0] = operation
	values[1] = oldRow
	values[2] = newRow
	for i, v := range content {
		values[i+3] = v
	}
	err := store.Set(iter, makeRange(0, len(values)), values)
	if err != nil {
		panic(err)
	}
}

func makeRange(min, max int) []int {
	a := make([]int, max-min)
	for i := range a {
		a[i] = min + i
	}
	return a
}
