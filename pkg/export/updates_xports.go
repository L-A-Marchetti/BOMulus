package export

import (
	"config"
	"core"
	"log"

	"github.com/xuri/excelize/v2"
)

func ExportUpdates(delta core.XlsmDelta, f, fOld *excelize.File, oldSheetName, sheetName string, i, rowsAdded int) int {
	// Store the cells updated.
	storeCells := []int{}
	for i := range core.XlsmFiles[0].Content[delta.OldRow] {
		if core.XlsmFiles[0].Content[delta.OldRow][i] != core.XlsmFiles[1].Content[delta.NewRow][i] {
			storeCells = append(storeCells, i)
		}
	}
	// Insert a new line.
	err := f.InsertRows(sheetName, i+1+rowsAdded, 1)
	if err != nil {
		log.Fatal(err)
	}
	// Copy and apply height of the old cell.
	rowHeight, err := fOld.GetRowHeight(oldSheetName, delta.OldRow+1)
	if err != nil {
		log.Fatal(err)
	}
	err = f.SetRowHeight(sheetName, i+1+rowsAdded, rowHeight)
	if err != nil {
		log.Fatal(err)
	}
	for j := range core.XlsmFiles[0].Content[delta.OldRow] {
		// Convert x, y coordinates to cell name
		oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
		newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
		// Copy the content from the old cell to the new one
		cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
		if err != nil {
			log.Fatal(err)
		}
		f.SetCellValue(sheetName, newCell, cellValue)
		// Copy the column width
		colName, _, _ := excelize.SplitCellName(newCell)
		colWidth, err := fOld.GetColWidth(oldSheetName, colName)
		if err != nil {
			log.Fatal(err)
		}
		err = f.SetColWidth(sheetName, colName, colName, colWidth)
		if err != nil {
			log.Fatal(err)
		}
		// Get the existing style of the old cell
		existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
		if err != nil {
			log.Fatal(err)
		}
		// Get the details of the existing style
		styleDetails, err := fOld.GetStyle(existingStyle)
		if err != nil {
			log.Fatal(err)
		}
		if core.ContainsInteger(storeCells, j) {
			// Modify the style to implement a background color
			styleDetails.Fill = excelize.Fill{
				Type:    "pattern",
				Color:   []string{config.OLD_UPDATE_DIFF_BG_COLOR},
				Pattern: 1,
			}
		} else {
			// Modify the style to implement a background color
			styleDetails.Fill = excelize.Fill{
				Type:    "pattern",
				Color:   []string{config.OLD_UPDATE_BG_COLOR},
				Pattern: 1,
			}
		}
		// Create a new style based on the old one
		newStyle, err := f.NewStyle(styleDetails)
		if err != nil {
			log.Fatal(err)
		}
		// Apply the new style
		err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
		if err != nil {
			log.Fatal(err)
		}
	}
	rowsAdded++
	// Copy the new row (NEW) without inserting a new line
	for j := range core.XlsmFiles[1].Content[delta.NewRow] {
		// Convert x, y coordinates to cell name
		newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)

		// Get the existing style of the new cell
		existingStyle, err := f.GetCellStyle(sheetName, newCell)
		if err != nil {
			log.Fatal(err)
		}
		// Get the details of the existing style
		styleDetails, err := f.GetStyle(existingStyle)
		if err != nil {
			log.Fatal(err)
		}
		if core.ContainsInteger(storeCells, j) {
			// Modify the style to implement a background color
			styleDetails.Fill = excelize.Fill{
				Type:    "pattern",
				Color:   []string{config.NEW_UPDATE_DIFF_BG_COLOR},
				Pattern: 1,
			}
		} else {
			// Modify the style to implement a background color
			styleDetails.Fill = excelize.Fill{
				Type:    "pattern",
				Color:   []string{config.NEW_UPDATE_BG_COLOR},
				Pattern: 1,
			}
		}
		// Create a new style based on the old one
		newStyle, err := f.NewStyle(styleDetails)
		if err != nil {
			log.Fatal(err)
		}
		// Apply the new style
		err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
		if err != nil {
			log.Fatal(err)
		}
	}
	return rowsAdded
}
