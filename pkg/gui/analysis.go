package gui

import (
	"components"
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
			//updateTableRow()
		})
	}

	glib.IdleAdd(func() {
		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
		compareView()
		//avoidDuplicate()
		//filtersHBox := filters()
		//vBox.Add(filtersHBox)
		//UpdateView()
	})
}
