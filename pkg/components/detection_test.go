package components

import (
	"reflect"
	"testing"

	"core" // Adjust this import path according to your project structure
)

func TestComponentsDetection(t *testing.T) {
	// Define test cases
	testCases := []struct {
		name                  string
		xlsmFiles             []core.XlsmFile
		expectedOldComponents []core.Component
		expectedNewComponents []core.Component
		expectedFilters       []core.Filter
	}{
		{
			name: "Data 1",
			xlsmFiles: []core.XlsmFile{
				{
					Content: [][]string{
						{"12345", "10", "Part A", "D1", "Manufacturer A"},
						{"67890", "5", "Part B", "D2", "Manufacturer B"},
					},
				},
				{
					Content: [][]string{
						{"54321", "15", "Part C", "D3", "Manufacturer C"},
						{"09876", "invalid_quantity", "Part D", "D4", "Manufacturer D"}, // Invalid quantity
					},
				},
			},
			expectedOldComponents: []core.Component{
				{Quantity: 10, Mpn: "12345", UserDescription: "Part A", Designator: "D1", UserManufacturer: "Manufacturer A"},
				{Quantity: 5, Mpn: "67890", UserDescription: "Part B", Designator: "D2", UserManufacturer: "Manufacturer B"},
			},
			expectedNewComponents: []core.Component{
				{Quantity: 15, Mpn: "54321", UserDescription: "Part C", Designator: "D3", UserManufacturer: "Manufacturer C"},
			},
			expectedFilters: []core.Filter{
				{Quantity: 1, Mpn: 0, Description: 2, Designator: 3, Manufacturer: 4, Header: 0}, // First file
				{Quantity: 1, Mpn: 0, Description: 2, Designator: 3, Manufacturer: 4, Header: 0}, // Second file
			},
		},
		{
			name: "Data 2",
			xlsmFiles: []core.XlsmFile{
				{
					Content: [][]string{
						{"Something before", "some text", ""},
						{"a lot of txt", "ok?", "enterprise"},
						{"m_p_n", " Quantity ", "description"},
						{"AZR12345", "10", "Part A"},
						{"BZ234645", "5", "Part B"},
					},
				},
				{
					Content: [][]string{
						{"manufacturername", "mpn", "quantity"},
						{"Manufacturer A", "12345", "10"},
						{"AZR12345", "10", "Part A"},
						{"BZ234645", "5", "Part B"},
						{"m_p_n", " Quantity ", "description"},
						{"AZR12345", "10", "Part A"},
						{"BZ234645", "5", "Part B"},
						{"AZR12345", "10", "Part A"},
						{"BZ234645", "Five", "Part B"}, //non-valid quantity so it should skipp this row.
					},
				},
			},
			expectedOldComponents: []core.Component{
				{Quantity: 10, Mpn: "AZR12345", UserDescription: "Part A", Designator: "AZR12345", UserManufacturer: "AZR12345"},
				{Quantity: 5, Mpn: "BZ234645", UserDescription: "Part B", Designator: "BZ234645", UserManufacturer: "BZ234645"},
			},
			expectedNewComponents: []core.Component{
				{Quantity: 10, Mpn: "AZR12345", UserDescription: "Part A", Designator: "AZR12345", UserManufacturer: "AZR12345"},
				{Quantity: 5, Mpn: "BZ234645", UserDescription: "Part B", Designator: "BZ234645", UserManufacturer: "BZ234645"},
				{Quantity: 10, Mpn: "AZR12345", UserDescription: "Part A", Designator: "AZR12345", UserManufacturer: "AZR12345"},
			},
			expectedFilters: []core.Filter{
				{Quantity: 1, Mpn: 0, Description: 2, Designator: 0, Manufacturer: 0, Header: 3}, // First file
				{Quantity: 1, Mpn: 0, Description: 2, Designator: 0, Manufacturer: 0, Header: 5}, // Second file
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Set the mock XlsmFiles for the test case
			core.XlsmFiles = tc.xlsmFiles

			// Set the filters for the test case
			core.Filters = tc.expectedFilters

			// Call the function to be tested
			ComponentsDetection()

			// Check if OldComponents match expected values
			if !reflect.DeepEqual(core.OldComponents, tc.expectedOldComponents) {
				t.Errorf("Got OldComponents: %+v, Want OldComponents: %+v", core.OldComponents, tc.expectedOldComponents)
			}

			// Check if NewComponents match expected values
			if !reflect.DeepEqual(core.NewComponents, tc.expectedNewComponents) {
				t.Errorf("Got NewComponents: %+v, Want NewComponents: %+v", core.NewComponents, tc.expectedNewComponents)
			}
		})
	}
}
