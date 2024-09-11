package gui

import (
	"components"
	"config"
	"core"
	"fmt"
	"strconv"

	"github.com/gotk3/gotk3/gtk"
)

func Output() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.Output()", false).Stop()
	}
	// Fill the tree with deltas content.
	for _, row := range core.XlsmDeltas {
		switch row.Operator {
		case "EQUAL":
			if core.Filters.Equal {
				appendRowWoBg(resultStore, "", fmt.Sprintf("%d", row.OldRow), fmt.Sprintf("%d", row.NewRow), core.XlsmFiles[1].Content[row.NewRow])
			}
		case "INSERT":
			if core.Filters.Insert {
				appendRow(resultStore, "INSERT", "", fmt.Sprintf("%d", row.NewRow), core.XlsmFiles[1].Content[row.NewRow], config.INSERT_BG_COLOR)
			}
		case "DELETE":
			if core.Filters.Delete {
				appendRow(resultStore, "DELETE", fmt.Sprintf("%d", row.OldRow), "", core.XlsmFiles[0].Content[row.OldRow], config.DELETE_BG_COLOR)
			}
		case "UPDATE":
			if core.Filters.Update {
				// First row for the old.
				appendRow(resultStore, "", fmt.Sprintf("%d", row.OldRow), fmt.Sprintf("%d", row.NewRow), core.XlsmFiles[0].Content[row.OldRow], config.OLD_UPDATE_BG_COLOR)
				// Second row for the new.
				appendRow(resultStore, "UPDATE", fmt.Sprintf("%d", row.OldRow), fmt.Sprintf("%d", row.NewRow), core.XlsmFiles[1].Content[row.NewRow], config.NEW_UPDATE_BG_COLOR)
			}
		}
	}
}

// Append row to the result store when there's an operator.
func appendRow(store *gtk.ListStore, operation, oldRow, newRow string, content []string, bgColor string) {
	iter := store.Append()
	values := make([]interface{}, (len(content)+4)*2)
	values[0] = StylizeOperation(operation)
	if operation != "UPDATE" {
		values[1] = oldRow
	} else {
		values[1] = ""
	}
	if operation != "" {
		values[2] = newRow
	} else {
		values[2] = ""
	}
	isOld := false
	intRow := 0
	if oldRow != "" {
		isOld = true
		intRow, _ = strconv.Atoi(oldRow)
	} else if newRow != "" {
		isOld = false
		intRow, _ = strconv.Atoi(newRow)
	}
	compIdx := components.FindComponentRowId(intRow, isOld)
	if compIdx != -1 && core.Components[compIdx].Analyzed {
		values[3] = config.INFO_BTN_CHAR
	} else {
		values[3] = ""
	}
	idx := 4
	for i, v := range content {
		values[i+4] = v
		idx++
	}
	storeCells := []int{}
	if operation == "" || operation == "UPDATE" {
		oRow, _ := strconv.Atoi(oldRow)
		nRow, _ := strconv.Atoi(newRow)
		for i := range core.XlsmFiles[0].Content[oRow] {
			// Hot fix.
			if len(core.XlsmFiles[1].Content[nRow])-1 < i {
				core.XlsmFiles[1].Content[nRow] = append(core.XlsmFiles[1].Content[nRow], "")
			} else if len(core.XlsmFiles[0].Content[oRow])-1 < i {
				core.XlsmFiles[0].Content[oRow] = append(core.XlsmFiles[0].Content[oRow], "")
			}
			// End of Hot fix.
			if core.XlsmFiles[0].Content[oRow][i] != core.XlsmFiles[1].Content[nRow][i] {
				storeCells = append(storeCells, i)
			}
		}
	}
	for j := idx; j < len(values); j++ {
		if core.ContainsInteger(storeCells, j-idx-4) {
			if operation == "" {
				values[j] = config.OLD_UPDATE_DIFF_BG_COLOR
			} else if operation == "UPDATE" {
				values[j] = config.NEW_UPDATE_DIFF_BG_COLOR
			}
		} else {
			values[j] = bgColor
		}
	}
	err := store.Set(iter, core.MakeRange(0, len(values)), values)
	core.ErrorsHandler(err)
}

// Append row to the result store when there's no bg color.
func appendRowWoBg(store *gtk.ListStore, operation, oldRow, newRow string, content []string) {
	iter := store.Append()
	values := make([]interface{}, len(content)+4)
	values[0] = operation
	values[1] = oldRow
	values[2] = newRow
	intNewRow, _ := strconv.Atoi(newRow)
	compIdx := components.FindComponentRowId(intNewRow, false)
	if compIdx != -1 && core.Components[compIdx].Analyzed {
		values[3] = config.INFO_BTN_CHAR
	} else {
		values[3] = ""
	}
	for i, v := range content {
		values[i+4] = v
	}
	err := store.Set(iter, core.MakeRange(0, len(values)), values)
	core.ErrorsHandler(err)
}
