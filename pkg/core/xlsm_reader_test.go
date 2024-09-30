package core

import (
	"reflect"
	"testing"
)

func TestXlsmReader(t *testing.T) {
	testCases := []struct {
		name     string
		filePath string
		expected [][]string
	}{
		{
			name:     "Test with file 1",
			filePath: "../../tests/test1.xlsx",
			expected: [][]string{
				{"Hello", "", "", ""},
				{"", "", "", "World"},
			},
		},
		{
			name:     "Test with file 2",
			filePath: "../../tests/test2.xlsx",
			expected: [][]string{
				{":/", "", "", "", ""},
				{"", `\$`, "", "corrupted", ""},
				{"", "", "£", "", `108\\304`},
				{"", "", "", "", ""},
				{"", "", "", `\n`, ""},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			XlsmFiles = []XlsmFile{
				{Path: tc.filePath},
				{Path: tc.filePath},
			}

			XlsmReader()

			if len(XlsmFiles[0].Content) == 0 {
				t.Errorf("Content for %s is empty", tc.filePath)
				return
			}

			if !reflect.DeepEqual(XlsmFiles[0].Content, tc.expected) {
				t.Errorf("Content mismatch for %s. Got: %v, Want: %v", tc.filePath, XlsmFiles[0].Content, tc.expected)
			}
		})
	}
}
