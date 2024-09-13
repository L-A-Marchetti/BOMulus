package components

import (
	"core"
	"io"
	"math"
	"net/http"

	"github.com/gotk3/gotk3/gdk"
)

/*
// Calculate total quantity of components. (still need to specify only new row)
func DiffSummary() []string {
	total, old, insertCount, updateCount, deleteCount, equalCount := 0, 0, 0, 0, 0, 0
	for _, component := range core.Components {
		if component.Operator == "INSERT" {
			total += component.Quantity
			insertCount++
		} else if component.Operator == "UPDATE" {
			total += component.NewQuantity
			old += component.OldQuantity
			updateCount++
		} else if component.Operator == "EQUAL" {
			total += component.Quantity
			old += component.Quantity
			equalCount++
		} else if component.Operator == "DELETE" {
			old += component.Quantity
			deleteCount++
		}
	}
	diff := total - old
	return []string{strconv.Itoa(total), strconv.Itoa(diff), strconv.Itoa(insertCount), strconv.Itoa(updateCount), strconv.Itoa(deleteCount), strconv.Itoa(equalCount)}
}
*/
/*
// Calculate components quantities diff between old and new BOM
func CompQuantityDiff() int {
	oldDiff := 0
	newDiff := 0
	for _, component := range core.Components {
		if component.OldRow != -1 && component.Operator != "EQUAL" {
			oldDiff += component.Quantity
		} else if component.NewRow != -1 && component.Operator != "EQUAL" {
			newDiff += component.Quantity
		}
	}
	diff := newDiff - oldDiff
	return diff
}
*/

// To find a component with a row reference.
func FindComponentRowId(idx int, isOld bool) int {
	for i, component := range core.Components {
		if isOld && component.OldRow == idx {
			return i
		} else if !isOld && component.NewRow == idx {
			return i
		}
	}
	return -1
}

// Determine number of components analyzed by the API.
func CmpAnalyzed() int {
	c := 0
	for _, component := range core.Components {
		if component.Analyzed {
			c++
		}
	}
	return c
}

// Bufferize an img from url.
func imgFromUrl(idx int) {
	// Request with a user-agent.
	req, err := http.NewRequest("GET", core.Components[idx].ImagePath, nil)
	if err == nil {
		req.Header.Set("User-Agent", "BOMulus")
		// Http client to execute the req.
		client := &http.Client{}
		resp, err := client.Do(req)
		if err == nil {
			defer resp.Body.Close()
			loader, _ := gdk.PixbufLoaderNew()
			defer loader.Close()
			_, err = io.Copy(loader, resp.Body)
			if err == nil {
				loader.Close()
				pixbuf, _ := loader.GetPixbuf()
				// Au lieu de créer une image GTK, on stocke le pixbuf dans le composant
				core.Components[idx].Img = pixbuf
			}
		}
	}
}

func colSafety(delta core.XlsmDelta) {
	colSafety := math.Max(math.Max(float64(core.Filters.Quantity), float64(core.Filters.Mpn)), float64(core.Filters.Description))
	for len(core.XlsmFiles[0].Content[delta.OldRow]) <= int(colSafety) {
		core.XlsmFiles[0].Content[delta.OldRow] = append(core.XlsmFiles[0].Content[delta.OldRow], "")
	}
	for len(core.XlsmFiles[1].Content[delta.NewRow]) <= int(colSafety) {
		core.XlsmFiles[1].Content[delta.NewRow] = append(core.XlsmFiles[1].Content[delta.NewRow], "")
	}
}

/*
func DiffCount() []string {
	insertCount, updateCount, deleteCount, equalCount := 0, 0, 0, 0
	for _, component := range core.Components {
		switch component.Operator {
		case "INSERT":
			insertCount++
		case "UPDATE": // Create a label with a formatted text.

			updateCount++
		case "DELETE":
			deleteCount++
		case "EQUAL":
			equalCount++
		}
	}
	return []string{strconv.Itoa(insertCount), strconv.Itoa(updateCount), strconv.Itoa(deleteCount), strconv.Itoa(equalCount)}
}
*/
