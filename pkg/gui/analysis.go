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
	totalComponents := len(core.Components)
	limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
	for i := 0; i < totalComponents; i++ {
		err := limiter.Wait(context.Background())
		if err != nil {
			log.Print(err)
			continue
		}
		components.APIRequest(i)

		glib.IdleAdd(func() {
			core.AnalysisState.Current = i + 1
			core.AnalysisState.Progress = float64(i+1) / float64(totalComponents)
			updateTableRow()
		})
	}

	glib.IdleAdd(func() {
		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
		//TODO: replace UpdateView() by a click emit.
		UpdateView()
	})
}