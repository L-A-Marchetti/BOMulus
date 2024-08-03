package export

import (
	"config"
	"core"
	"fmt"
	"net/url"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/xuri/excelize/v2"
)

func Export() {
	originalFile := [2]string{}
	for i := range originalFile {
		// Generate paths for the original and the copied files.
		originalFile[i], _ = url.PathUnescape(strings.TrimSpace(strings.TrimPrefix(core.XlsmFiles[i].Path, config.FILE_PREFIX)))
		// Check if the operating system is Windows.
		if runtime.GOOS == "windows" {
			// Added line for Windows file path.
			originalFile[i] = strings.TrimPrefix(originalFile[i], "/")
		}
	}
	copiedFile := "BOMulus" + filepath.Base(originalFile[1])
	// Copy original file.
	err := core.CopyFile(originalFile[1], copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Open copied file.
	f, err := excelize.OpenFile(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	// Open old file.
	fOld, err := excelize.OpenFile(originalFile[0])
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := fOld.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	// Sheet name.
	sheetName := f.GetSheetName(0)
	oldSheetName := fOld.GetSheetName(0)
	rowsAdded := 0
	for i, delta := range core.XlsmDeltas {
		if delta.Operator == "INSERT" {
			for j := range core.XlsmFiles[1].Content[delta.NewRow] {
				// Convert x y coordinates into cell name.
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
		} else if delta.Operator == "DELETE" {
			// Insert a new row into the copied file.
			err = f.InsertRows(sheetName, i+1+rowsAdded, 1)
			if err != nil {
				fmt.Println(err)
				return
			}
			// Copy the row height.
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
				// Convert x, y coordinates into cell name.
				oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
				// Copy content from the old cell to the new cell.
				cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				f.SetCellValue(sheetName, newCell, cellValue)
				// Copy column width.
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
				// Obtain existing style of the old cell.
				existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Obtain details on existing style.
				styleDetails, err := fOld.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Modify the style to implement a background color.
				styleDetails.Fill = excelize.Fill{
					Type:    "pattern",
					Color:   []string{config.DELETE_BG_COLOR},
					Pattern: 1,
				}
				// Create a new style based on the old one.
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Apply the new style.
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		} else if delta.Operator == "UPDATE" {
			storeCells := []int{}
			for i := range core.XlsmFiles[0].Content[delta.OldRow] {
				if core.XlsmFiles[0].Content[delta.OldRow][i] != core.XlsmFiles[1].Content[delta.NewRow][i] {
					storeCells = append(storeCells, i)
				}
			}
			// Insert a new row to display the old row.
			err = f.InsertRows(sheetName, i+1+rowsAdded, 1)
			if err != nil {
				fmt.Println(err)
				return
			}
			// Copy the row height.
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
				// Convert x, y coordinates into cell name.
				oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
				// Copy content from the old cell to the new cell.
				cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				f.SetCellValue(sheetName, newCell, cellValue)
				// Copy column width.
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
				// Obtain existing style of the old cell.
				existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Obtain details on existing style.
				styleDetails, err := fOld.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
				if core.ContainsInteger(storeCells, j) {
					// Modify the style to implement a background color.
					styleDetails.Fill = excelize.Fill{
						Type:    "pattern",
						Color:   []string{config.OLD_UPDATE_DIFF_BG_COLOR},
						Pattern: 1,
					}
				} else {
					// Modify the style to implement a background color.
					styleDetails.Fill = excelize.Fill{
						Type:    "pattern",
						Color:   []string{config.OLD_UPDATE_BG_COLOR},
						Pattern: 1,
					}
				}
				// Create a new style based on the old one.
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Apply the new style.
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
			rowsAdded++
			// Copy the new line (NEW) without inserting a new line.
			for j := range core.XlsmFiles[1].Content[delta.NewRow] {
				// Convert x, y coordinates into cell name.
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
				// Obtain existing style of the new cell.
				existingStyle, err := f.GetCellStyle(sheetName, newCell)
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
				if core.ContainsInteger(storeCells, j) {
					// Modify the style to implement a background color.
					styleDetails.Fill = excelize.Fill{
						Type:    "pattern",
						Color:   []string{config.NEW_UPDATE_DIFF_BG_COLOR},
						Pattern: 1,
					}
				} else {
					// Modify the style to implement a background color.
					styleDetails.Fill = excelize.Fill{
						Type:    "pattern",
						Color:   []string{config.NEW_UPDATE_BG_COLOR},
						Pattern: 1,
					}
				}
				// Create a new style based on the old one.
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Apply the new style.
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
	// Save copied and modified file.
	err = f.SaveAs(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
}
