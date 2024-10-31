/*
* Package: components
* File: header_detection.go
*
* Description:
* This file contains a function for automatically detecting the header row
* in an Excel file containing a Bill of Materials (BOM). It identifies key
* columns such as quantity, manufacturer part number, description, designator,
* and manufacturer.
*
* Main Function:
* - HeaderDetection: Analyzes the content of an Excel file to detect the header
*   row and identify important column indices.
*
* Input:
* - file (*core.XlsmFile): Pointer to a structure representing the Excel file
*   containing the BOM data.
*
* Output:
* - The function modifies the file.Filters struct in-place, setting the indices
*   for key columns and the header row.
 */

package components

import (
	"config"
	"core"
	"strings"
)

// HeaderDetection automatically detects the header row in the Excel file
// and identifies the indices of important columns.
func HeaderDetection(file *core.XlsmFile) {
	if config.DEBUGGING {
		defer core.StartBenchmark("HeaderDetection()", false).Stop()
	}
	header := 0
	// Iterate through each row in the file
	for i, row := range file.Content {
		// Iterate through each cell in the row
		for j, col := range row {
			// Check if the cell contains any of the predefined keywords
			if core.ContainsKeywords(col) {
				// Normalize the cell content for comparison
				normalizedCol := strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(col, " ", ""), "_", ""))
				// Identify specific columns based on their headers
				switch normalizedCol {
				case "quantity":
					file.Filters.Quantity = j
				case "manufacturerpartnumber", "mpn":
					file.Filters.Mpn = j
				case "description":
					file.Filters.Description = j
				case "designator":
					file.Filters.Designator = j
				case "manufacturer", "manufacturername":
					file.Filters.Manufacturer = j
				}
				// Update the header row index
				header = i
			}
		}
	}
	// Set the header row in the file's filters (adding 1 to convert from 0-based to 1-based index)
	file.Filters.Header = header + 1
}
