/*
* Package: core
* File: components_detection.go
*
* Description:
* This file contains a function for detecting and extracting component information
* from an Excel file containing a Bill of Materials (BOM). It processes each row
* after the header row to create Component structures.
*
* Main Function:
* - ComponentsDetection: Analyzes the content of an Excel file to extract
*   component information and populate the Components slice in the XlsmFile structure.
*
* Input:
* - file (*XlsmFile): Pointer to a structure representing the Excel file
*   containing the BOM data, including header information and filters.
*
* Output:
* - The function modifies the file.Components slice in-place, adding Component
*   structures for each valid row in the Excel file.
*
* Note:
* This function assumes that the header row has been previously detected and
* the Filters structure in the XlsmFile has been properly populated with column
* indices. It skips rows where the quantity cannot be converted to an integer.
 */

package core

import (
	"config"
	"strconv"
	"strings"
)

// ComponentsDetection processes the Excel file to extract component information
// from each row after the header row.
func ComponentsDetection(file *XlsmFile) {
	if config.DEBUGGING {
		defer StartBenchmark("ComponentsDetection()", false).Stop()
	}
	// Iterate through each row in the file
	for i, row := range file.Content {
		// Process only rows after the header row
		if i >= file.Filters.Header {
			// Attempt to convert the quantity to an integer
			quantity, err := strconv.Atoi(row[file.Filters.Quantity])
			if err != nil {
				// Skip this row if quantity is not a valid integer
				continue
			}
			// Create a new Component structure with data from the current row
			component := Component{
				Quantity:         quantity,
				Mpn:              strings.TrimSpace(row[file.Filters.Mpn]),
				UserDescription:  row[file.Filters.Description],
				Designator:       row[file.Filters.Designator],
				Designators:      designator_parser(row[file.Filters.Designator]),
				UserManufacturer: row[file.Filters.Manufacturer],
			}
			// Add the new component to the Components slice
			file.Components = append(file.Components, component)
		}
	}
}
