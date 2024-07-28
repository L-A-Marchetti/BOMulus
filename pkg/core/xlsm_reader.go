package core

import (
	"log"
	"net/url"
	"strings"

	"github.com/xuri/excelize/v2"
)

func XlsmReader() {
	for i := range XlsmFiles {
		// Trim decode and clean the file path.
		filePath, err := url.PathUnescape(strings.TrimSpace(strings.TrimPrefix(XlsmFiles[i].Path, "file://")))
		if err != nil {
			log.Fatal(err)
		}
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
		for _, row := range rows {
			var rowSlice []string
			rowSlice = append(rowSlice, row...)
			XlsmFiles[i].Content = append(XlsmFiles[i].Content, rowSlice)
		}
	}
}
