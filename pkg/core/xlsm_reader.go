package core

import (
	"fmt"
	"log"
	"strings"

	"github.com/xuri/excelize/v2"
)

func XlsmReader() {
	// Trim and clean the file path.
	filePath := strings.TrimSpace(strings.TrimPrefix(XlsmFiles[0].Path, "file://"))
	// Open xlsm file.
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := f.Close(); err != nil {
			log.Fatal(err)
		}
	}()
	// Read every used rows.
	rows, err := f.GetRows(f.GetSheetName(0))
	if err != nil {
		log.Fatal(err)
	}
	// Convert data into a string matrice.
	var xlsmData [][]string
	for _, row := range rows {
		var rowSlice []string
		rowSlice = append(rowSlice, row...)
		xlsmData = append(xlsmData, rowSlice)
	}
	// Display data for prototyping.
	for _, row := range xlsmData {
		fmt.Println(row)
	}
}
