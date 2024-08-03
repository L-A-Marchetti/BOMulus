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
			ExportInserts(delta, f, sheetName, i, rowsAdded)
		} else if delta.Operator == "DELETE" {
			ExportDeletes(delta, f, fOld, oldSheetName, sheetName, i, rowsAdded)
		} else if delta.Operator == "UPDATE" {
			rowsAdded = ExportUpdates(delta, f, fOld, oldSheetName, sheetName, i, rowsAdded)
		}
		// Save copied and modified file.
		err = f.SaveAs(copiedFile)
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
