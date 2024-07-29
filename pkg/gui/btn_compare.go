package gui

import (
	"core"
	"fmt"
	"strings"
)

func BtnCompare() {
	core.XlsmReader()
	core.XlsmDiff()
	resultStore.Clear()

	for _, row := range core.XlsmDeltas {
		var operation, oldRow, newRow, content string
		switch row.Operator {
		case "EQUAL":
			operation = ""
			oldRow = fmt.Sprintf("%d", row.OldRow)
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = strings.Join(core.XlsmFiles[1].Content[row.NewRow], " ")
			iter := resultStore.Append()
			resultStore.Set(iter, []int{0, 1, 2, 3}, []interface{}{operation, oldRow, newRow, content})
		case "INSERT":
			operation = "INSERT"
			oldRow = ""
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = strings.Join(core.XlsmFiles[1].Content[row.NewRow], " ")
			iter := resultStore.Append()
			resultStore.Set(iter, []int{0, 1, 2, 3}, []interface{}{operation, oldRow, newRow, content})
		case "DELETE":
			operation = "DELETE"
			oldRow = fmt.Sprintf("%d", row.OldRow)
			newRow = ""
			content = strings.Join(core.XlsmFiles[0].Content[row.OldRow], " ")
			iter := resultStore.Append()
			resultStore.Set(iter, []int{0, 1, 2, 3}, []interface{}{operation, oldRow, newRow, content})
		case "UPDATE":
			// First line for the old row
			operation = ""
			oldRow = fmt.Sprintf("%d", row.OldRow)
			newRow = ""
			content = strings.Join(core.XlsmFiles[0].Content[row.OldRow], " ")
			iter := resultStore.Append()
			resultStore.Set(iter, []int{0, 1, 2, 3}, []interface{}{operation, oldRow, newRow, content})

			// Second line for the new row
			operation = "UPDATE"
			oldRow = ""
			newRow = fmt.Sprintf("%d", row.NewRow)
			content = strings.Join(core.XlsmFiles[1].Content[row.NewRow], " ")
			iter = resultStore.Append()
			resultStore.Set(iter, []int{0, 1, 2, 3}, []interface{}{operation, oldRow, newRow, content})
		}
	}
	/* Display deltas for prototyping purpose.
	for _, row := range core.XlsmDeltas {
		if row.Operator == "EQUAL" {
			fmt.Println("EQUAL\n", row.OldRow, row.NewRow, core.XlsmFiles[1].Content[row.NewRow])
		} else if row.Operator == "INSERT" {
			fmt.Println("INSERT\n", row.NewRow, core.XlsmFiles[1].Content[row.NewRow])
		} else if row.Operator == "DELETE" {
			fmt.Println("DELETE\n", row.OldRow, core.XlsmFiles[0].Content[row.OldRow])
		} else {
			fmt.Println("UPDATE\n", row.OldRow, core.XlsmFiles[0].Content[row.OldRow], "\n", row.NewRow, core.XlsmFiles[1].Content[row.NewRow])
		}
	}
	*/
}
