/*
* Package: core
* File: xlsm_diff.go
*
* Description:
* This file contains a function for comparing two slices of components and
* determining the differences between them. It updates the global Components
* slice based on whether components have been added, updated, or deleted.
*
* Main Function:
* - XlsmDiff: Compares two slices of components and categorizes them as
*   EQUAL, UPDATE, INSERT, or DELETE based on their Manufacturer Part Numbers (MPN)
*   and quantities.
*
* Input:
* - v1 ([]Component): The first slice of components to compare.
* - v2 ([]Component): The second slice of components to compare; can be nil.
*
* Output:
* - Updates the global Components slice with diff operators
 */

package core

import "config"

// XlsmDiff compares two slices of components and updates the global Components slice
// based on the differences found between them.
func XlsmDiff(v1, v2 []Component) {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}
	// Group old components by Manufacturer Part Number (MPN)
	oldComponentsGrouped := groupByMpn(v1)
	var newComponentsGrouped []Component
	// Group new components or use old components if v2 is nil
	if v2 != nil {
		newComponentsGrouped = groupByMpn(v2)
	} else {
		newComponentsGrouped = oldComponentsGrouped
	}
	compId := 0 // Initialize component ID counter
	// Process new components to find matches with old components
	for _, newComponent := range newComponentsGrouped {
		matchFound := false // Flag to track if a match is found
		for _, oldComponent := range oldComponentsGrouped {
			if newComponent.Mpn == oldComponent.Mpn {
				if newComponent.Quantity == oldComponent.Quantity {
					// If quantities match, mark as EQUAL
					newComponent.Operator = "EQUAL"
					newComponent.Id = compId
					Components = append(Components, newComponent)
				} else {
					// If MPN matches but quantities differ, mark as UPDATE
					newComponent.Operator = "UPDATE"
					newComponent.OldQuantity = oldComponent.Quantity
					newComponent.NewQuantity = newComponent.Quantity
					newComponent.Id = compId
					Components = append(Components, newComponent)
				}
				matchFound = true // Set flag to true since a match was found
				compId++          // Increment component ID counter
				break             // Exit the inner loop once a match is found
			}
		}
		if !matchFound {
			// If no match was found, mark as INSERT
			newComponent.Operator = "INSERT"
			newComponent.Id = compId
			Components = append(Components, newComponent)
			compId++ // Increment component ID counter for inserted component
		}
	}
	// Process old components to find any that were deleted
	for _, oldComponent := range oldComponentsGrouped {
		matchFound := false // Flag to track if a match is found
		for _, newComponent := range newComponentsGrouped {
			if oldComponent.Mpn == newComponent.Mpn {
				matchFound = true // Match found; no deletion needed
				break             // Exit the inner loop if a match is found
			}
		}
		if !matchFound {
			// If no match was found, mark as DELETE
			oldComponent.Operator = "DELETE"
			oldComponent.Id = compId
			Components = append(Components, oldComponent)
			compId++ // Increment component ID counter for deleted component
		}
	}
}
