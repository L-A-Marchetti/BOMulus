package export

import (
	"config"
	"core"
	"fmt"

	"github.com/xuri/excelize/v2"
)

func ExportInserts(delta core.XlsmDelta, f *excelize.File, sheetName string, i, rowsAdded int) {
	for j := range core.XlsmFiles[1].Content[delta.NewRow] {
		// Convert x y coordinates into acell name.
		cell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
		// Obtain existing style.
		existingStyle, err := f.GetCellStyle(sheetName, cell)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Obtain details on existing style.
		styleDetails, err := f.GetStyle(existingStyle)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Modify the style to implement a background color.
		styleDetails.Fill = excelize.Fill{
			Type:    "pattern",
			Color:   []string{config.INSERT_BG_COLOR},
			Pattern: 1,
		}
		// Duplicate it.
		newStyle, err := f.NewStyle(styleDetails)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Apply it.
		err = f.SetCellStyle(sheetName, cell, cell, newStyle)
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
