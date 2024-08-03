package export

import (
	"config"
	"core"
	"fmt"
	"net/url"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/xuri/excelize/v2"
)

func Export() {
	originalFile := [2]string{}
	for i := range originalFile {
		// Generate paths for the original and the copied files.
		originalFile[i], _ = url.PathUnescape(strings.TrimSpace(strings.TrimPrefix(core.XlsmFiles[i].Path, config.FILE_PREFIX)))
		// Check if the operating system is Windows.
		if runtime.GOOS == "windows" {
			// Added line for Windows file path.
			originalFile[i] = strings.TrimPrefix(originalFile[i], "/")
		}
	}
	copiedFile := "BOMulus" + filepath.Base(originalFile[1])
	// Copy original file.
	err := core.CopyFile(originalFile[1], copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	// Open copied file.
	f, err := excelize.OpenFile(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	// Open old file.
	fOld, err := excelize.OpenFile(originalFile[0])
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := fOld.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	// Sheet name.
	sheetName := f.GetSheetName(0)
	oldSheetName := fOld.GetSheetName(0)
	rowsAdded := 0
	for i, delta := range core.XlsmDeltas {
		if delta.Operator == "INSERT" {
			for j := range core.XlsmFiles[1].Content[delta.NewRow] {
				// Convert x y coordinates into acell name.
				cell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)
				// Obtain existing style.
				existingStyle, err := f.GetCellStyle(sheetName, cell)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Obtain details on existing style.
				styleDetails, err := f.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Modify the style to implement a background color.
				styleDetails.Fill = excelize.Fill{
					Type:    "pattern",
					Color:   []string{config.INSERT_BG_COLOR},
					Pattern: 1,
				}
				// Duplicate it.
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Apply it.
				err = f.SetCellStyle(sheetName, cell, cell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		} else if delta.Operator == "DELETE" {
			// Insérer une nouvelle ligne dans le fichier copié
			err = f.InsertRows(sheetName, i+1+rowsAdded, 1)
			if err != nil {
				fmt.Println(err)
				return
			}

			// Copier la hauteur de la ligne
			rowHeight, err := fOld.GetRowHeight(oldSheetName, delta.OldRow+1)
			if err != nil {
				fmt.Println(err)
				return
			}
			err = f.SetRowHeight(sheetName, i+1+rowsAdded, rowHeight)
			if err != nil {
				fmt.Println(err)
				return
			}

			for j := range core.XlsmFiles[0].Content[delta.OldRow] {
				// Convertir les coordonnées x, y en nom de cellule
				oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)

				// Copier le contenu de l'ancienne cellule vers la nouvelle
				cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				f.SetCellValue(sheetName, newCell, cellValue)

				// Copier la largeur de la colonne
				colName, _, _ := excelize.SplitCellName(newCell)
				colWidth, err := fOld.GetColWidth(oldSheetName, colName)
				if err != nil {
					fmt.Println(err)
					return
				}
				err = f.SetColWidth(sheetName, colName, colName, colWidth)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Obtenir le style existant de l'ancienne cellule
				existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Obtenir les détails du style existant
				styleDetails, err := fOld.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Modifier le style pour implémenter une couleur de fond
				styleDetails.Fill = excelize.Fill{
					Type:    "pattern",
					Color:   []string{config.DELETE_BG_COLOR},
					Pattern: 1,
				}

				// Créer un nouveau style basé sur l'ancien
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Appliquer le nouveau style
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		} else if delta.Operator == "UPDATE" {
			// Insérer une nouvelle ligne pour afficher l'ancienne ligne
			err = f.InsertRows(sheetName, i+1+rowsAdded, 1)
			if err != nil {
				fmt.Println(err)
				return
			}

			// Copier la hauteur de la ligne
			rowHeight, err := fOld.GetRowHeight(oldSheetName, delta.OldRow+1)
			if err != nil {
				fmt.Println(err)
				return
			}
			err = f.SetRowHeight(sheetName, i+1+rowsAdded, rowHeight)
			if err != nil {
				fmt.Println(err)
				return
			}

			for j := range core.XlsmFiles[0].Content[delta.OldRow] {
				// Convertir les coordonnées x, y en nom de cellule
				oldCell, _ := excelize.CoordinatesToCellName(j+1, delta.OldRow+1)
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)

				// Copier le contenu de l'ancienne cellule vers la nouvelle
				cellValue, err := fOld.GetCellValue(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}
				f.SetCellValue(sheetName, newCell, cellValue)

				// Copier la largeur de la colonne
				colName, _, _ := excelize.SplitCellName(newCell)
				colWidth, err := fOld.GetColWidth(oldSheetName, colName)
				if err != nil {
					fmt.Println(err)
					return
				}
				err = f.SetColWidth(sheetName, colName, colName, colWidth)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Obtenir le style existant de l'ancienne cellule
				existingStyle, err := fOld.GetCellStyle(oldSheetName, oldCell)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Obtenir les détails du style existant
				styleDetails, err := fOld.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
				// Modifier le style pour implémenter une couleur de fond
				styleDetails.Fill = excelize.Fill{
					Type:    "pattern",
					Color:   []string{config.OLD_UPDATE_BG_COLOR},
					Pattern: 1,
				}

				// Créer un nouveau style basé sur l'ancien
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Appliquer le nouveau style
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
			rowsAdded++
			// Copier la nouvelle ligne (NEW) sans insérer de nouvelle ligne
			for j := range core.XlsmFiles[1].Content[delta.NewRow] {
				// Convertir les coordonnées x, y en nom de cellule
				newCell, _ := excelize.CoordinatesToCellName(j+1, i+1+rowsAdded)

				// Obtenir le style existant de la nouvelle cellule
				existingStyle, err := f.GetCellStyle(sheetName, newCell)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Obtenir les détails du style existant
				styleDetails, err := f.GetStyle(existingStyle)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Modifier le style pour implémenter une couleur de fond
				styleDetails.Fill = excelize.Fill{
					Type:    "pattern",
					Color:   []string{config.NEW_UPDATE_BG_COLOR},
					Pattern: 1,
				}

				// Créer un nouveau style basé sur l'ancien
				newStyle, err := f.NewStyle(styleDetails)
				if err != nil {
					fmt.Println(err)
					return
				}

				// Appliquer le nouveau style
				err = f.SetCellStyle(sheetName, newCell, newCell, newStyle)
				if err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
	// Save copied and modified file.
	err = f.SaveAs(copiedFile)
	if err != nil {
		fmt.Println(err)
		return
	}
}
