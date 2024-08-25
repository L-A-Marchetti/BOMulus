package gui

import (
	"config"
	"core"

	"github.com/gotk3/gotk3/gtk"
)

var TriggerAnalyze func()

func btnAnalyze(analyzeButtonBox *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.btnAnalyze()", false).Stop()
	}
	if core.AnalysisState.InProgress {
		// Create the progress bar.
		progressBar := createProgressBar()
		analyzeButtonBox.Add(progressBar)
	} else if core.AnalysisState.Completed {
		// Create the report button.
		analyzeButton := createButton("Report")
		analyzeButtonBox.Add(analyzeButton)
		analyzeButton.Connect("clicked", func() {
			ShowReport()
		})
	} else {
		analyzeButton := createButton("Analyze")
		analyzeButtonBox.Add(analyzeButton)
		// Run the analysis if the API key is valid.
		analyzeFunc := func() {
			if core.AnalysisState.KeyIsValid {
				// Initialize analysis state.
				core.AnalysisState.InProgress, core.AnalysisState.Total, core.AnalysisState.Current, core.AnalysisState.Progress = true, len(core.Components), 0, 0.0
				progressBar := createProgressBar()
				analyzeButtonBox.Remove(analyzeButton)
				analyzeButtonBox.Add(progressBar)
				analyzeButtonBox.ShowAll()
				go runAnalysis()
				UpdateView()
			} else {
				// Ask for the API key and check the validity.
				UserApiKey()
			}
		}
		analyzeButton.Connect("clicked", analyzeFunc)
		SetupTriggerAnalyze(analyzeFunc)
	}
}

func SetupTriggerAnalyze(analyzeFunc func()) {
	TriggerAnalyze = analyzeFunc
}
