package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/glib"
	"github.com/gotk3/gotk3/gtk"
)

var TriggerAnalyze func()

func btnAnalyze(analyzeButtonBox *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.btnAnalyze()", false).Stop()
	}
	runAnalysisButton := createButton("Run Analysis")
	viewReportButton := createButton("View Report")
	analyzeButtonBox.Add(runAnalysisButton)
	analyzeButtonBox.Add(viewReportButton)
	viewReportButton.SetSensitive(false)
	analyzeFunc := func() {
		core.ResetAnalysisStatus()
		afterApiKey := func() {
			if !core.AnalysisState.KeyIsValid {
				return
			}
			AnalysisRange(func() {
				if core.AnalysisState.IdxStart == -1 || core.AnalysisState.IdxEnd == -1 {
					return
				}
				core.AnalysisState.InProgress = true
				core.AnalysisState.Total = core.AnalysisState.IdxEnd - core.AnalysisState.IdxStart + 1
				core.AnalysisState.Current = 0
				core.AnalysisState.Progress = 0.0

				glib.IdleAdd(func() {
					analyzeButtonBox.Remove(runAnalysisButton)
					progressBar := createProgressBar()
					analyzeButtonBox.Add(progressBar)
					analyzeButtonBox.ShowAll()

					// Désactiver le bouton "View Report" pendant l'analyse
					viewReportButton.SetSensitive(false)

					// Lancer l'analyse
					go runAnalysis(progressBar, viewReportButton, runAnalysisButton, analyzeButtonBox)
				})
			})
		}

		if !core.AnalysisState.KeyIsValid {
			UserApiKey(afterApiKey)
		} else {
			afterApiKey()
		}
	}

	runAnalysisButton.Connect("clicked", analyzeFunc)
	SetupTriggerAnalyze(analyzeFunc)

	viewReportButton.Connect("clicked", func() {
		ShowReport()
	})

	analyzeButtonBox.ShowAll()
}

func SetupTriggerAnalyze(analyzeFunc func()) {
	TriggerAnalyze = analyzeFunc
}
