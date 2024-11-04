/*
* Package: main
* File: app.go
*
* Description:
* This file contains the main application logic for the Wails framework.
* It defines the App structure and methods that connect the frontend with
* the backend functionalities of the application.
 */

package main

import (
	"components"
	"config"
	"context"
	"core"
	"fmt"
	"workspaces"

	"github.com/skratchdot/open-golang/open"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

/*╔══════════════ COMPONENTS FUNCTIONS ══════════════╗*/

// GetComponents retrieves all components.
func (a *App) GetComponents() []core.Component {
	return core.Components
}

// GetComponent retrieves a specific component by index.
func (a *App) GetComponent(i int) core.Component {
	return core.Components[i]
}

func (a *App) PriceCalculator(quantity float64) (components.PriceCalculationResult, error) {
	return components.QuantityPrice(int(quantity))
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ ANALYSIS FUNCTIONS ══════════════╗*/

// RunAnalysis initiates the analysis of components by calling the AnalyzeComponents function.
func (a *App) RunAnalysis() error {
	return components.AnalyzeComponents() // Delegate analysis to the components package
}

// GetAnalysisState retrieves the current analysis state.
func (a *App) GetAnalysisState() core.AnalysisStatus {
	return core.AnalysisState
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ WINDOW FUNCTIONS ══════════════╗*/

// OpenExternalLink opens an external link in the default browser.
func (a *App) OpenExternalLink(s string) {
	err := open.Run(s)
	core.ErrorsHandler(err)
}

// MinimizeWindow minimizes the application window.
func (a *App) MinimizeWindow() {
	runtime.WindowMinimise(a.ctx)
}

// MaximizeWindow maximizes the application window if it is not already maximized.
func (a *App) MaximizeWindow() {
	isMaximised := runtime.WindowIsMaximised(a.ctx)
	if !isMaximised {
		runtime.WindowMaximise(a.ctx)
	}
}

// CloseWindow closes the application window.
func (a *App) CloseWindow() {
	runtime.Quit(a.ctx)
}

// BtnCompare launch the diff processing.
func (a *App) BtnCompare(v1, v2 []core.Component) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.BtnCompare()", true).Stop()
	}
	core.ResetComponents()
	core.XlsmDiff(v1, v2)
	core.ResetAnalysisStatus()
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ DIALOG FUNCTIONS ══════════════╗*/

// OpenDirectoryDialog opens a directory selection dialog and returns the selected path.
func (a *App) OpenDirectoryDialog() string {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Workspace Directory",
	})
	if err != nil {
		fmt.Println("Error opening directory dialog:", err)
		return ""
	}
	return selection
}

// OpenFileDialog opens a file selection dialog and returns the selected file path.
func (a *App) OpenFileDialog() (string, error) {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select File to Add",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "All Files",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return "", fmt.Errorf("error opening file dialog: %w", err)
	}
	return selection, nil
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ WORKSPACE FUNCTIONS ══════════════╗*/

// SetActiveWorkspace sets the active workspace path.
func (a *App) SetActiveWorkspace(path string) {
	workspaces.ActiveWorkspaceMutex.Lock()
	defer workspaces.ActiveWorkspaceMutex.Unlock()
	// Reset components when an active workspace is set.
	core.ResetComponents()
	workspaces.ActiveWorkspacePath = path
}

// GetActiveWorkspace returns the active workspace path.
func (a *App) GetActiveWorkspace() string {
	workspaces.ActiveWorkspaceMutex.RLock()
	defer workspaces.ActiveWorkspaceMutex.RUnlock()
	return workspaces.ActiveWorkspacePath
}

// CreateWorkspace initiates the creation of a new workspace by delegating to the workspaces package.
func (a *App) CreateWorkspace(path string, name string) error {
	return workspaces.CreateWorkspace(path, name) // Delegate to workspaces package
}

// GetRecentWorkspaces retrieves the most recently created workspaces by delegating to the workspaces package.
func (a *App) GetRecentWorkspaces() ([]workspaces.Workspace, error) {
	return workspaces.GetRecentWorkspaces() // Delegate to workspaces package
}

// AddFileToWorkspace initiates adding a file to the active workspace by delegating to workspaces package.
func (a *App) AddFileToWorkspace(filePath string) error {
	activeWorkspace := a.GetActiveWorkspace()                       // Get active workspace path
	return workspaces.AddFileToWorkspace(activeWorkspace, filePath) // Delegate to workspaces package
}

// GetFilesInWorkspaceInfo retrieves files in the active workspace's .bmls by delegating to workspaces package.
func (a *App) GetFilesInWorkspaceInfo() ([]workspaces.FileInfo, error) {
	activeWorkspace := a.GetActiveWorkspace()                  // Get active workspace path
	return workspaces.GetFilesInWorkspaceInfo(activeWorkspace) // Delegate to workspaces package
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ API KEY FUNCTIONS ══════════════╗*/

// GetSavedAPIKeys retrieves saved API keys by delegating to the workspaces package.
func (a *App) GetSavedAPIKeys() (workspaces.APIKeys, error) {
	return workspaces.GetSavedAPIKeys() // Delegate to workspaces package
}

// TestMouserAPIKey tests if the provided Mouser API key is valid.
func (a *App) TestMouserAPIKey(apiKey string) (bool, error) {
	err := components.TestAPIKey(apiKey, "mouser")
	if err != nil {
		return false, err
	}
	return true, nil
}

// TestBOMulusAPIKey tests if the provided BOMulus API key is valid.
func (a *App) TestBOMulusAPIKey(apiKey string) (bool, error) {
	// Implement logic to test BOMulus API key here.
	return true, nil // Return true if valid; otherwise false.
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ ANALYSIS CONFIG FUNCTIONS ══════════════╗*/

// GetAnalyzeSaveState retrieves the analyze save state by delegating to workspaces package.
func (a *App) GetAnalyzeSaveState() (bool, error) {
	return workspaces.GetAnalyzeSaveState() // Delegate to workspaces package
}

// SetAnalyzeSaveState sets the analyze save state by updating BOMulus.bmls.
func (a *App) SetAnalyzeSaveState(state bool) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, state, true, -1)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYZE_SAVE_STATE = state
	return nil
}

// GetAnalysisRefreshDays retrieves the analysis refresh days by delegating to workspaces package.
func (a *App) GetAnalysisRefreshDays() (int, error) {
	return workspaces.GetAnalysisRefreshDays() // Delegate to workspaces package
}

// SetAnalysisRefreshDays sets the analysis refresh days by updating BOMulus.bmls.
func (a *App) SetAnalysisRefreshDays(refreshDays int) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, false, false, refreshDays)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYSIS_REFRESH_DAYS = refreshDays
	return nil
}

/*╚══════════════════════════════════════════════╝*/
