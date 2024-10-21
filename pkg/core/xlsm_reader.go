package core

import (
	"config"

	"github.com/xuri/excelize/v2"
)

func XlsmReader(file *XlsmFile) {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmReader()", true).Stop()
	}
	// Open the file
	f, err := excelize.OpenFile(file.Path)
	ErrorsHandler(err)
	defer f.Close()
	// Read every used row
	rows, err := f.GetRows(f.GetSheetName(0))
	ErrorsHandler(err)
	// Freshly added to avoid some special characters to jump a line.
	rows = fixLn(rows)
	// Convert data into a string matrix
	file.Content = append(file.Content, rows...)
	blankTailsFix(file)
}
