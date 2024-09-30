package core

import (
	"reflect"
	"testing"
)

func TestHasValidExtension(t *testing.T) {
	testCases := []struct {
		name     string
		filename string
		expected bool
	}{
		{"Valid .xlsm file", "bomv1.xlsm", true},
		{"Valid .xlsx file", "bomv2.xlsx", true},
		{"Invalid extension", "bomv3.jpg", false},
		{"Invalid extension", "bomv4.txt", false},
		{"Invalid extension", "bomv4.xls", false},
		{"No extension", "bomv5", false},
		{"Hidden file with valid extension", ".hidden.xlsm", true},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := HasValidExtension(tc.filename)
			if result != tc.expected {
				t.Errorf("HasValidExtension(%s) = %v; want %v", tc.filename, result, tc.expected)
			}
		})
	}
}

func TestContainsKeywords(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected bool
	}{
		{"Exact match", "Designator", true},
		{"Lowercase match", "description", true},
		{"Uppercase match", "QUANTITY", true},
		{"With spaces", "Part Number", true},
		{"Uppercase with spaces", "MANUFACTURER NAME", true},
		{"Lowercase with spaces", "manufacturer part number", true},
		{"With underscores", "Supplier_Part_Number", true},
		{"Uppercase with underscores", "TEMPERATURE_COEFFICIENT", true},
		{"Lowercase with underscores", "lifecycle_status", true},
		{"Mixed case with spaces and underscore", "life_Cycle status", true},
		{"Non-matching word", "Footer", false},
		{"Partial match", "Manu", false},
		{"Empty string", "", false},
		{"Footprint with spaces and underscore", "Foo      t_print", true},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := ContainsKeywords(tc.input)
			if result != tc.expected {
				t.Errorf("ContainsKeywords(%q) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestBlankTailsFix(t *testing.T) {
	// Sauvegarde de la variable globale originale
	originalXlsmFiles := XlsmFiles
	defer func() {
		// Restauration de la variable globale originale après le test
		XlsmFiles = originalXlsmFiles
	}()

	testCases := []struct {
		name     string
		input    []XlsmFile
		expected []XlsmFile
	}{
		{
			name: "Different column counts",
			input: []XlsmFile{
				{Content: [][]string{{"A", "B"}, {"C", "D", "E"}}},
				{Content: [][]string{{"1", "2", "3", "4"}, {"5", "6"}}},
			},
			expected: []XlsmFile{
				{Content: [][]string{{"A", "B", "", ""}, {"C", "D", "E", ""}}},
				{Content: [][]string{{"1", "2", "3", "4"}, {"5", "6", "", ""}}},
			},
		},
		{
			name: "Already equal columns",
			input: []XlsmFile{
				{Content: [][]string{{"A", "B"}, {"C", "D"}}},
				{Content: [][]string{{"1", "2"}, {"3", "4"}}},
			},
			expected: []XlsmFile{
				{Content: [][]string{{"A", "B"}, {"C", "D"}}},
				{Content: [][]string{{"1", "2"}, {"3", "4"}}},
			},
		},
		{
			name: "Empty input",
			input: []XlsmFile{
				{Content: [][]string{}},
				{Content: [][]string{}},
			},
			expected: []XlsmFile{
				{Content: [][]string{}},
				{Content: [][]string{}},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Remplacement de la variable globale avec les données de test
			XlsmFiles = tc.input

			// Appel de la fonction réelle
			blankTailsFix()

			// Vérification du résultat
			if !reflect.DeepEqual(XlsmFiles, tc.expected) {
				t.Errorf("blankTailsFix() resulted in %v, want %v", XlsmFiles, tc.expected)
			}
		})
	}
}

func TestGroupByMpn(t *testing.T) {
	testCases := []struct {
		name     string
		input    []Component
		expected []Component
	}{
		{
			name: "Single component",
			input: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			expected: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
		},
		{
			name: "Multiple components, no duplicates",
			input: []Component{
				{Mpn: "MPN123", Quantity: 10},
				{Mpn: "MPN456", Quantity: 5},
			},
			expected: []Component{
				{Mpn: "MPN123", Quantity: 10},
				{Mpn: "MPN456", Quantity: 5},
			},
		},
		{
			name: "Multiple components with duplicates",
			input: []Component{
				{Mpn: "MPN123", Quantity: 10},
				{Mpn: "MPN456", Quantity: 5},
				{Mpn: "MPN123", Quantity: 15}, // Duplicate MPN
			},
			expected: []Component{
				{Mpn: "MPN123", Quantity: 25}, // Quantity should be summed
				{Mpn: "MPN456", Quantity: 5},
			},
		},
		{
			name: "All duplicates",
			input: []Component{
				{Mpn: "MPN123", Quantity: 10},
				{Mpn: "MPN123", Quantity: 5}, // All duplicates
				{Mpn: "MPN123", Quantity: 15},
			},
			expected: []Component{
				{Mpn: "MPN123", Quantity: 30}, // Total quantity should be summed
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := groupByMpn(tc.input)

			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("For %s, Got: %v, Want: %v", tc.name, result, tc.expected)
			}
		})
	}
}
