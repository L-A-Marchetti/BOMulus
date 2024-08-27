package components

import (
	"core"
	"io"
	"net/http"

	"github.com/gotk3/gotk3/gdk"
)

// Calculate total quantity of components. (still need to specify only new row)
func CompTotalQuantity() int {
	total := 0
	for _, component := range core.Components {
		if component.NewRow != -1 {
			total += component.Quantity
		}
	}
	return total
}

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
