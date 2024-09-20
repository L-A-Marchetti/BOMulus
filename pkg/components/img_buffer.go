package components

import (
	"core"
	"io"
	"net/http"

	"github.com/gotk3/gotk3/gdk"
)

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
				core.Components[idx].Img = pixbuf
			}
		}
	}
}
