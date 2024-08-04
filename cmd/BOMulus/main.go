package main

import (
	"gui"
	"os"
	"path/filepath"
	"runtime"
)

// Define the Gsettings schemas dir in the env path.
func init() {
	if runtime.GOOS == "windows" {
		// Get executable path.
		exePath, err := os.Executable()
		if err != nil {
			panic(err)
		}
		// GSettings schemas path.
		schemaDir := filepath.Join(filepath.Dir(exePath), "share", "glib-2.0", "schemas")
		// Define env path.
		err = os.Setenv("GSETTINGS_SCHEMA_DIR", schemaDir)
		if err != nil {
			panic(err)
		}
	}
}

func main() {
	gui.GuiInit()
}
