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
	// Define a background color.
	style, err := f.NewStyle(&excelize.Style{
		Fill: excelize.Fill{Type: "pattern", Color: []string{"#FFFF00"}, Pattern: 1},
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	// Apply style to cell rox 3 col 3 for prototyping.
	cell := "C3"
	err = f.SetCellStyle(sheetName, cell, cell, style)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Save copied and modified file.
	err = f.SaveAs(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
}
