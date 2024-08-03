package export

import (
	"config"
	"core"
	"fmt"

	"github.com/xuri/excelize/v2"
)

func ExportDeletes(delta core.XlsmDelta, f, fOld *excelize.File, oldSheetName, sheetName string, i, rowsAdded int) {
	// Insert a new line.
	err := f.InsertRows(sheetName, i+1+rowsAdded, 1)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Copy and apply height of the of the old cell.
	rowHeight, err := fOld.GetRowHeight(oldSheetName, delta.OldRow+1)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = f.SetRowHeight(sheetName, i+1+rowsAdded, rowHeight)
	if err != nil {
		fmt.Println(err)
		return
	}
	for j := range core.XlsmFiles[0].Content[delta.OldRow] {
		// Convert coordinates into cell names.
		oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
		newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
		// Copy old cell content into the new one.
		cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
		if err != nil {
			fmt.Println(err)
			return
		}
		f.SetCellValue(sheetName, newCell, cellValue)
		// copy and apply old cell width.
		colName, _, _ := excelize.SplitCellName(newCell)
		colWidth, err := fOld.GetColWidth(oldSheetName, colName)
		if err != nil {
			fmt.Println(err)
			return
		}
		err = f.SetColWidth(sheetName, colName, colName, colWidth)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Get the style of the old cell.
		existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Get style details.
		styleDetails, err := fOld.GetStyle(existingStyle)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Add background to the existing style.
		styleDetails.Fill = excelize.Fill{
			Type:    "pattern",
			Color:   []string{config.DELETE_BG_COLOR},
			Pattern: 1,
		}
		// Duplicate the style.
		newStyle, err := f.NewStyle(styleDetails)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Apply it to the new cell.
		err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
