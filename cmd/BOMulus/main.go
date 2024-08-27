package main

import (
	"core"
	"gui"
	"os"
	"path/filepath"
	"runtime"
)

// Define the Gsettings schemas dir in the env path.
func init() {
	if runtime.GOOS == "windows" {
		exePath, err := os.Executable()
		core.ErrorsHandler(err)
		schemaDir := filepath.Join(filepath.Dir(exePath), "share", "glib-2.0", "schemas")
		err = os.Setenv("GSETTINGS_SCHEMA_DIR", schemaDir)
		core.ErrorsHandler(err)
	}
}

func main() {
	gui.GuiInit()
}
