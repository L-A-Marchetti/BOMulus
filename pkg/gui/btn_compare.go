package gui

import (
	"core"
)

func BtnCompare() {
	core.XlsmReader()
	core.XlsmDiff()
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
