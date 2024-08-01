package core

import (
	"fmt"

	"github.com/gotk3/gotk3/gtk"
)

// Determine the maximum number of columns.
func MaxCol() int {
	maxColumns := 0
	for _, file := range XlsmFiles {
		for _, row := range file.Content {
			if len(row) > maxColumns {
				maxColumns = len(row)
			}
		}
	}
	return maxColumns
}

// Helper function to generate generic column titles.
func GetColumnTitles(count int) []string {
	titles := make([]string, count)
	for i := 0; i < count; i++ {
		titles[i] = fmt.Sprintf("Column %d", i+1)
	}
	return titles
}

func MakeRange(min, max int) []int {
	a := make([]int, max-min)
	for i := range a {
		a[i] = min + i
	}
	return a
}

// If a checkbox is toggled change the filters.
func SetFilters(checkboxes []*gtk.CheckButton) {
	for _, cb := range checkboxes {
		label, _ := cb.GetLabel()
		switch label {
		case "EQUAL":
			if cb.GetActive() {
				Filters.Equal = true
			} else {
				Filters.Equal = false
			}
		case "DELETE":
			if cb.GetActive() {
				Filters.Delete = true
			} else {
				Filters.Delete = false
			}
		case "INSERT":
			if cb.GetActive() {
				Filters.Insert = true
			} else {
				Filters.Insert = false
			}
		case "UPDATE":
			if cb.GetActive() {
				Filters.Update = true
			} else {
				Filters.Update = false
			}
		case "SWAP":
			if cb.GetActive() {
				Filters.Swap = true
			} else {
				Filters.Swap = false
			}
			//Swap Xlsms.
			XlsmFiles[0], XlsmFiles[1] = XlsmFiles[1], XlsmFiles[0]
			// Read and store both Xlsm files.
			XlsmReader()
			// Generate delta data.
			XlsmDiff()
		}
	}
}

// Initialize checkboxes.
func InitFilters(i int, cb *gtk.CheckButton) *gtk.CheckButton {
	switch i {
	case 0:
		if Filters.Equal {
			cb.SetActive(true)
		} else {
			cb.SetActive(false)
		}
	case 1:
		if Filters.Delete {
			cb.SetActive(true)
		} else {
			cb.SetActive(false)
		}
	case 2:
		if Filters.Insert {
			cb.SetActive(true)
		} else {
			cb.SetActive(false)
		}
	case 3:
		if Filters.Update {
			cb.SetActive(true)
		} else {
			cb.SetActive(false)
		}
	case 4:
		if Filters.Swap {
			cb.SetActive(true)
		} else {
			cb.SetActive(false)
		}
	}
	return cb
}

// Function to now if []int contains i.
func ContainsInteger(slice []int, i int) bool {
	for _, v := range slice {
		if v == i {
			return true
		}
	}
	return false
}
