/*
* Package: core
* File: xlsm_reader.go
*
* Description:
* This file contains a function for reading data from Excel files using the
* excelize library. It processes the specified file, retrieves all used rows
* from the first sheet, and stores the content in a structured format for
* further processing.
*
* Main Function:
* - XlsmReader: Opens an Excel file, reads its content, and updates the
*   XlsmFile structure with the retrieved data.
*
* Input:
* - file (*XlsmFile): Pointer to a structure representing the Excel file,
*   which includes the path to the file and a slice to store the content.
*
* Output:
* - The function modifies the file.Content slice in-place, appending the
*   rows read from the Excel file.
*
* Note:
* This function assumes that the provided path is valid and that the file
* exists. It handles potential errors during file opening and reading.
 */

package core

import (
	"config"

	"github.com/xuri/excelize/v2"
)

// XlsmReader reads data from an Excel file and updates
// the provided XlsmFile structure with its content.
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
	// Fix the blank tails skipped by the GetRows function.
	blankTailsFix(file)
}
