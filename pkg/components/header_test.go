package components

import (
	"core"
	"testing"
)

func TestHeaderDetection(t *testing.T) {
	// Define test cases
	testCases := []struct {
		name            string
		xlsmFiles       []core.XlsmFile
		expectedFilters []core.Filter
	}{
		{
			name: "Single Header Row",
			xlsmFiles: []core.XlsmFile{
				{
					Content: [][]string{
						{"MPN", "Quantity", "Description"},
						{"12345", "10", "Part A"},
						{"67890", "5", "Part B"},
					},
				},
				{
					Content: [][]string{
						{"Manufacturer", "MPN", "Quantity"},
						{"Manufacturer A", "12345", "10"},
						{"Manufacturer B", "67890", "5"},
					},
				},
			},
			expectedFilters: []core.Filter{
				{Quantity: 1, Mpn: 0, Description: 2, Header: 1},  // First file
				{Quantity: 2, Mpn: 1, Manufacturer: 0, Header: 1}, // Second file
			},
		},
		{
			name: "Multiple Headers with Different Cases",
			xlsmFiles: []core.XlsmFile{
				{
					Content: [][]string{
						{"mpn", " Quantity ", "description"},
						{"12345", "10", "Part A"},
					},
				},
				{
					Content: [][]string{
						{"manufacturername", "mpn", "quantity"},
						{"Manufacturer A", "12345", "10"},
					},
				},
			},
			expectedFilters: []core.Filter{
				{Quantity: 1, Mpn: 0, Description: 2, Header: 1},  // First file
				{Quantity: 2, Mpn: 1, Manufacturer: 0, Header: 1}, // Second file
			},
		},
		{
			name: "Asynchrone Headers",
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
					},
				},
			},
			expectedFilters: []core.Filter{
				{Quantity: 1, Mpn: 0, Description: 2, Header: 3}, // First file
				{Quantity: 1, Mpn: 0, Description: 2, Header: 5}, // Second file
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Set the mock XlsmFiles for the test case
			core.XlsmFiles = tc.xlsmFiles

			// Call the function to be tested
			HeaderDetection()

			// Check if the filters match expected values
			for i := range tc.expectedFilters {
				if core.Filters[i] != tc.expectedFilters[i] {
					t.Errorf("For %s, Got Filter[%d]: %+v, Want Filter[%d]: %+v",
						tc.name, i, core.Filters[i], i, tc.expectedFilters[i])
				}
			}
		})
	}
}
