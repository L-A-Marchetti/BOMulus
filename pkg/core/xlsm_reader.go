package core

import (
	"config"
	"os"

	"github.com/xuri/excelize/v2"
)

func XlsmReader() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmReader()", true).Stop()
	}
	ResetContent()
	var tempFiles []string
	defer func() {
		// Clean up temporary files
		for _, file := range tempFiles {
			os.Remove(file)
		}
	}()
	for i := range XlsmFiles {
		tempFiles = append(tempFiles, XlsmFiles[i].Path)
		// Open the file
		f, err := excelize.OpenFile(XlsmFiles[i].Path)
		ErrorsHandler(err)
		defer f.Close()
		// Read every used row
		rows, err := f.GetRows(f.GetSheetName(0))
		ErrorsHandler(err)
		// Freshly added to avoid some special characters to jump a line.
		rows = fixLn(rows)
		// Convert data into a string matrix
		XlsmFiles[i].Content = append(XlsmFiles[i].Content, rows...)
	}
	blankTailsFix()
}
