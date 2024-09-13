package gui

import (
	"components"
	"config"
	"context"
	"core"
	"log"
	"time"

	"github.com/gotk3/gotk3/glib"
	"golang.org/x/time/rate"
)

func runAnalysis() {
	totalComponents := core.AnalysisState.IdxEnd - core.AnalysisState.IdxStart + 1
	limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
	insertRow, updateRow, deleteRow, equalRow := 0, 0, 0, 0
	for i := core.AnalysisState.IdxStart; i <= core.AnalysisState.IdxEnd; i++ {
		err := limiter.Wait(context.Background())
		if err != nil {
			log.Print(err)
			continue
		}
		components.APIRequest(i)
		glib.IdleAdd(func() {
			core.AnalysisState.Current += 1
			core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents)
			compButton := createButton(config.INFO_BTN_CHAR)
			compButton.Connect("clicked", func() {
				ShowComponent(i)
			})
			gridIdx := 0
			switch core.Components[i].Operator {
			case "INSERT":
				gridIdx = 0
				insertRow++
			case "UPDATE":
				gridIdx = 1
				updateRow++
			case "DELETE":
				gridIdx = 2
				deleteRow++
			case "EQUAL":
				gridIdx = 3
				equalRow++
			}
			rowIdx := []int{insertRow, updateRow, deleteRow, equalRow}
			oldButton, _ := Grids[gridIdx].GetChildAt(4, rowIdx[gridIdx])
			Grids[gridIdx].Remove(oldButton)
			Grids[gridIdx].Attach(compButton, 4, rowIdx[gridIdx], 1, 1)
			Grids[gridIdx].ShowAll()
		})
	}

	glib.IdleAdd(func() {
		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
		compareView()
	})
}
