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
	"sync"
	"time"
	"workspaces"

	"golang.org/x/time/rate"
)

var done chan struct{}

// AnalyzeComponents analyzes the components and updates their state.
// Mouser and DigiKey requests are processed independently with their own rate limits.
func AnalyzeComponents() error {
	errChan := make(chan error, 1)
	if done != nil {
		done = nil
	}
	done = make(chan struct{})

	// Création des limiteurs pour Mouser et DigiKey
	mouserLimiter := rate.NewLimiter(rate.Every(2*time.Second), 1)         // 2 requêtes par secondes
	digikeyLimiter := rate.NewLimiter(rate.Every(500*time.Millisecond), 1) // 120 requêtes par minute

	totalComponents := len(core.Components)
	refreshThreshold := time.Now().AddDate(0, 0, -config.ANALYSIS_REFRESH_DAYS)

	var wg sync.WaitGroup
	wg.Add(2) // Deux goroutines pour Mouser et DigiKey

	// Mutex pour protéger les mises à jour partagées
	var mu sync.Mutex

	// Goroutine pour gérer les requêtes Mouser
	go func() {
		defer wg.Done()
		for i := 0; i < totalComponents; i++ {
			select {
			case <-done:
				return // Exit if done signal is received
			default:
				mouserAnalyzed := false
				for _, source := range core.Components[i].Sources {
					if source == "Mouser" {
						mouserAnalyzed = true
					}
				}
				if core.Components[i].Analyzed && mouserAnalyzed && core.Components[i].LastRefresh.After(refreshThreshold) {
					continue // Skip already analyzed components within refresh threshold
				}
				if err := mouserLimiter.Wait(context.Background()); err != nil {
					log.Print(err) // Log Mouser rate limit errors
					continue
				}
				if err := APIRequest(i); err != nil {
					log.Println(err)
					errChan <- err // Send error to channel if analysis fails
					return
				}
				// Mises à jour partagées
				mu.Lock()
				//core.Components[i].Analyzed = true
				core.AnalysisState.Current++
				core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents) * 100
				if config.ANALYZE_SAVE_STATE {
					workspaces.UpdateBMLSComponents(core.Components[i])
				}
				mu.Unlock()
			}
		}
	}()

	// Goroutine pour gérer les requêtes DigiKey
	go func() {
		defer wg.Done()
		for i := 0; i < totalComponents; i++ {
			select {
			case <-done:
				return // Exit if done signal is received
			default:
				dkAnalyzed := false
				for _, source := range core.Components[i].Sources {
					if source == "Digikey" {
						dkAnalyzed = true
					}
				}
				if core.Components[i].Analyzed && dkAnalyzed && core.Components[i].LastRefresh.After(refreshThreshold) {
					continue // Skip already analyzed components within refresh threshold
				}
				if err := digikeyLimiter.Wait(context.Background()); err != nil {
					log.Print(err) // Log DigiKey rate limit errors
					continue
				}
				if err := APIRequestToDigiKey(i); err != nil {
					log.Println(err)
					errChan <- err // Send error to channel if analysis fails
					return
				}
				// Mises à jour partagées
				mu.Lock()
				core.Components[i].Analyzed = true
				core.AnalysisState.Current++
				core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents) * 100
				if config.ANALYZE_SAVE_STATE {
					workspaces.UpdateBMLSComponents(core.Components[i])
				}
				mu.Unlock()
			}
		}
	}()

	// Attendre que les deux goroutines aient terminé
	go func() {
		wg.Wait()
		close(errChan) // Close error channel when done
	}()

	// Gérer les erreurs
	select {
	case err, ok := <-errChan:
		if ok {
			close(done) // Signal the goroutine to stop if an error occurs
			return err  // Return the error encountered during analysis
		}
	}

	core.AnalysisState.InProgress = false
	core.AnalysisState.Completed = true
	return nil // Return nil if no errors occurred during analysis
}

// StopAnalysis signals the analysis to stop
func StopAnalysis() {
	if done != nil {
		// Vérifier si le canal est déjà fermé avant de tenter de le fermer
		select {
		case <-done:
			// Le canal est déjà fermé, ne fais rien
			return
		default:
			// Le canal n'est pas encore fermé, donc on peut le fermer
			close(done)
		}
	}
	core.AnalysisState.InProgress = false
}
