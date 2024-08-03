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
	// Generate paths for the original and the copied files.
	originalFile, _ := url.PathUnescape(strings.TrimSpace(strings.TrimPrefix(core.XlsmFiles[1].Path, config.FILE_PREFIX)))
	// Check if the operating system is Windows.
	if runtime.GOOS == "windows" {
		// Added line for Windows file path.
		originalFile = strings.TrimPrefix(originalFile, "/")
	}
	copiedFile := "BOMulus" + filepath.Base(originalFile)
	// Copy original file.
	err := core.CopyFile(originalFile, copiedFile)
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
	// Sheet name.
	sheetName := f.GetSheetName(0)
	for i, delta := range core.XlsmDeltas {
		if delta.Operator == "INSERT" {
			for j := range core.XlsmFiles[1].Content[delta.NewRow] {
				// Convert x y coordinates into acell name.
				cell, _ := excelize.CoordinatesToCellName(j+1, i+1)
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
	}
	// Save copied and modified file.
	err = f.SaveAs(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
}
