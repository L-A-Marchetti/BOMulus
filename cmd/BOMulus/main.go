package main

import (
	"gui"
	"os"
	"path/filepath"
	"runtime"
)

func init() {
	if runtime.GOOS == "windows" {
		// Obtenez le chemin de l'exécutable
		exePath, err := os.Executable()
		if err != nil {
			panic(err)
		}

		// Construisez le chemin vers le dossier des schémas
		schemaDir := filepath.Join(filepath.Dir(exePath), "share", "glib-2.0", "schemas")

		// Définissez la variable d'environnement
		err = os.Setenv("GSETTINGS_SCHEMA_DIR", schemaDir)
		if err != nil {
			panic(err)
		}
	}
}

func main() {
	gui.GuiInit()
}
