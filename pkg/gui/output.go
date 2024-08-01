package gui

import (
	"config"
	"core"
	"fmt"

	"github.com/gotk3/gotk3/gtk"
)

func Output() {
	// Fill the tree with deltas content.
	for _, row := range core.XlsmDeltas {
		var operation, oldRow, newRow, bgColor string
		var content []string
		switch row.Operator {
		case "EQUAL":
			if core.Filters.Equal {
				operation = ""
				oldRow = fmt.Sprintf("%d", row.OldRow)
				newRow = fmt.Sprintf("%d", row.NewRow)
				content = core.XlsmFiles[1].Content[row.NewRow]
				bgColor = config.EQUAL_BG_COLOR
				appendRowWoBg(resultStore, operation, oldRow, newRow, content)
			}
		case "INSERT":
			if core.Filters.Insert {
				operation = "INSERT"
				oldRow = ""
				newRow = fmt.Sprintf("%d", row.NewRow)
				content = core.XlsmFiles[1].Content[row.NewRow]
				bgColor = config.INSERT_BG_COLOR
				appendRow(resultStore, operation, oldRow, newRow, content, bgColor)
			}
		case "DELETE":
			if core.Filters.Delete {
				operation = "DELETE"
				oldRow = fmt.Sprintf("%d", row.OldRow)
				newRow = ""
				content = core.XlsmFiles[0].Content[row.OldRow]
				bgColor = config.DELETE_BG_COLOR
				appendRow(resultStore, operation, oldRow, newRow, content, bgColor)
			}
		case "UPDATE":
			if core.Filters.Update {
				// First row for the old.
				appendRow(resultStore, "", fmt.Sprintf("%d", row.OldRow), "", core.XlsmFiles[0].Content[row.OldRow], config.OLD_UPDATE_BG_COLOR)
				// Second row for the new.
				operation = "UPDATE"
				oldRow = ""
				newRow = fmt.Sprintf("%d", row.NewRow)
				content = core.XlsmFiles[1].Content[row.NewRow]
				bgColor = config.NEW_UPDATE_BG_COLOR
				appendRow(resultStore, operation, oldRow, newRow, content, bgColor)
			}
		}
	}
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

	err := store.Set(iter, core.MakeRange(0, len(values)), values)
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
	err := store.Set(iter, core.MakeRange(0, len(values)), values)
	if err != nil {
		panic(err)
	}
}
