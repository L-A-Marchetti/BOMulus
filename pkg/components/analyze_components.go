/*
* Package: components
* File: analyze_components.go
*
* Description:
* This file contains functions related to the analysis of components.
* It includes functionality for analyzing components from the core package
* and updating their state based on API responses.
*
* Main Functions:
* - AnalyzeComponents: Analyzes components and updates their state,
*   handling progress tracking and error management.
* - StopAnalysis: Use the done signal to stop the analysis when the active workspace changes.
 */

package components

import (
	"config"
	"context"
	"core"
	"log"
	"time"
	"workspaces"

	"golang.org/x/time/rate"
)

var done chan struct{}

// AnalyzeComponents analyzes the components and updates their state.
// It tracks progress and handles errors during the analysis process.
func AnalyzeComponents() error {
	errChan := make(chan error, 1)
	if done != nil {
		done = nil
	}
	done = make(chan struct{})
	go func() {
		totalComponents := len(core.Components)
		limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
		refreshThreshold := time.Now().AddDate(0, 0, -config.ANALYSIS_REFRESH_DAYS)
		for i := 0; i < totalComponents; i++ {
			err := limiter.Wait(context.Background())
			if err != nil {
				log.Print(err) // Log any rate limiting errors
				continue
			}
			select {
			case <-done:
				return // Exit if done signal is received
			default:
				if core.Components[i].Analyzed {
					if core.Components[i].LastRefresh.After(refreshThreshold) {
						core.AnalysisState.Current++
						core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents) * 100
						continue // Skip already analyzed components within refresh threshold
					}
				}
				APIErr := APIRequest(i) // Call the APIRequest function for analysis
				if APIErr != nil {
					errChan <- APIErr // Send error to channel if analysis fails
					return
				}
				if config.ANALYZE_SAVE_STATE {
					workspaces.UpdateBMLSComponents(core.Components[i]) // Save component state if configured to do so
				}
				core.AnalysisState.Current++
				core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents) * 100
			}
		}
		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
		close(errChan) // Close error channel when done
	}()
	select {
	case err, ok := <-errChan:
		if ok {
			close(done) // Signal the goroutine to stop if an error occurs
			return err  // Return the error encountered during analysis
		}
	}
	return nil // Return nil if no errors occurred during analysis
}

// StopAnalysis signals the analysis to stop
func StopAnalysis() {
	close(done)
	core.AnalysisState.InProgress = false
}
