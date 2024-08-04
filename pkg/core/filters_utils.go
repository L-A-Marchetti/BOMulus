package core

import "github.com/gotk3/gotk3/gtk"

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
			if cb.GetActive() && !Filters.Swap {
				Filters.Swap = true
				//Swap Xlsms.
				XlsmFiles[0], XlsmFiles[1] = XlsmFiles[1], XlsmFiles[0]
			} else if !cb.GetActive() && Filters.Swap {
				Filters.Swap = false
				//Swap Xlsms.
				XlsmFiles[0], XlsmFiles[1] = XlsmFiles[1], XlsmFiles[0]
			}
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
