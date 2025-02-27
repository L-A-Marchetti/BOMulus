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
	"path/filepath"
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

func (a *App) PriceCalculator(activeWorkspace workspaces.Workspace, quantity float64) (components.PriceCalculationResult, error) {
	return components.QuantityPrice(activeWorkspace, int(quantity))
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ ANALYSIS FUNCTIONS ══════════════╗*/

// RunAnalysis initiates the analysis of components by calling the AnalyzeComponents function.
func (a *App) RunAnalysis(activeWorkspace workspaces.Workspace) error {
	return components.AnalyzeComponents(activeWorkspace) // Delegate analysis to the components package
}

// StopAnalysis send the done message to the analysis goroutine to stop it.
func (a *App) StopAnalysis() {
	components.StopAnalysis()
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

// OpenImportFileDialog opens a bmls selection dialog and returns the workspace path to import.
func (a *App) OpenImportFileDialog() error {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a BOMulus file to import",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "BMLS files",
				Pattern:     "*.bmls",
			},
		},
	})
	if err != nil {
		return fmt.Errorf("Error opening file dialog: %w", err)
	}
	ws, err := workspaces.GetWorkspaceInfo(selection)
	if err != nil {
		return fmt.Errorf("Error reading the BMLS file: %w", err)
	}
	err = workspaces.ImportWorkspace(ws, filepath.Dir(selection))
	if err != nil {
		return fmt.Errorf("Error importing the BMLS file: %w", err)
	}
	return nil
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

// OpenMultipleFilesDialog opens a file selection dialog allowing multiple files and returns the selected file paths.
func (a *App) OpenMultipleFilesDialog() ([]string, error) {
	selection, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Files to Add",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "All Files",
				Pattern:     "*.*",
			},
			{
				DisplayName: "Excel Files",
				Pattern:     "*.xls;*.xlsx;*.xlsm",
			},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("error opening file dialog: %w", err)
	}
	return selection, nil
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ WORKSPACE FUNCTIONS ══════════════╗*/

// SetActiveWorkspace sets the active workspace path.
func (a *App) SetActiveWorkspace(activeWorkspace workspaces.Workspace) error {
	core.ResetComponents()
	return workspaces.UpdateLastOpened(activeWorkspace)
}

func (a *App) DeleteWorkspace(workspaceToDelete workspaces.Workspace) error {
	return workspaces.DeleteWorkspace(workspaceToDelete)
}

func (a *App) DeleteBOMFile(activeWorkspace workspaces.Workspace, fileToDelete workspaces.FileInfo) {
	workspaces.DeleteBOMFile(activeWorkspace, fileToDelete)
}

// GetActiveWorkspace returns the active workspace path.
/*
func (a *App) GetActiveWorkspace() string {
	workspaces.ActiveWorkspaceMutex.RLock()
	defer workspaces.ActiveWorkspaceMutex.RUnlock()
	return workspaces.ActiveWorkspacePath
}
*/
// CreateWorkspace initiates the creation of a new workspace by delegating to the workspaces package.
func (a *App) CreateWorkspace(path string, name string) error {
	return workspaces.CreateWorkspace(path, name) // Delegate to workspaces package
}

// GetRecentWorkspaces retrieves the most recently created workspaces by delegating to the workspaces package.
func (a *App) GetRecentWorkspaces() ([]workspaces.Workspace, error) {
	return workspaces.GetRecentWorkspaces() // Delegate to workspaces package
}

func (a *App) HeaderFiltersFileValidation(filePath string) (core.XlsmFile, error) {
	_, _, file := workspaces.FileProcessing(filePath)
	return file, nil
}

// AddFileToWorkspace initiates adding a file to the active workspace by delegating to workspaces package.
func (a *App) AddFileToWorkspace(activeWorkspace workspaces.Workspace, file core.XlsmFile) error {
	//activeWorkspace := a.GetActiveWorkspace() // Get active workspace path
	return workspaces.AddFileToWorkspace(activeWorkspace, file) // Delegate to workspaces package
}

// GetFilesInWorkspaceInfo retrieves files in the active workspace's .bmls by delegating to workspaces package.
func (a *App) GetFilesInWorkspaceInfo(activeWorkspace workspaces.Workspace) ([]workspaces.FileInfo, error) {
	//activeWorkspace := a.GetActiveWorkspace()                  // Get active workspace path
	return workspaces.GetFilesInWorkspaceInfo(activeWorkspace) // Delegate to workspaces package
}

func (a *App) UpdateVersionTags(files []workspaces.FileInfo) error {
	return workspaces.UpdateVersionTags(files)
}

func (a *App) UpdateLastComparison(activeWorkspace workspaces.Workspace, v1, v2 workspaces.FileInfo) error {
	return workspaces.UpdateLastComparison(activeWorkspace, v1, v2)
}

func (a *App) GetLastComparison(activeWorkspace workspaces.Workspace) (workspaces.Comparison, error) {
	return workspaces.GetLastComparison(activeWorkspace)
}

func (a *App) UpdateDesignators(designators []core.Designator) {
	workspaces.UpdateDesignators(designators)
}

func (a *App) UpdateBMLSDesignators(activeWorkspace workspaces.Workspace) error {
	return workspaces.UpdateBMLSDesignators(activeWorkspace)
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ API KEY FUNCTIONS ══════════════╗*/

// GetSavedAPIKeys retrieves saved API keys by delegating to the workspaces package.
func (a *App) GetSavedAPIKeys() (workspaces.APIKeys, error) {
	return workspaces.GetSavedAPIKeys() // Delegate to workspaces package
}

// TestMouserAPIKey tests if the provided Mouser API key is valid.
func (a *App) TestMouserAPIKey(apiKey string) (bool, error) {
	err := components.TestAPIKey(apiKey, "", "", "mouser")
	if err != nil {
		return false, err
	}
	return true, nil
}

// TestDKCredentials tests if the provided digikey API credentials are valid.
func (a *App) TestDKCredentials(clientID, clientSecret string) (bool, error) {
	err := components.TestAPIKey("", clientID, clientSecret, "dk")
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

func (a *App) GetApiCount() (int, error) {
	return workspaces.GetApiCount()
}

// SetAnalyzeSaveState sets the analyze save state by updating BOMulus.bmls.
func (a *App) SetAnalyzeSaveState(state bool) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, state, true, -1, nil)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYZE_SAVE_STATE = state
	return nil
}
/*
// GetProductionQuantity retrieves the selected production quantity by delegating to workspaces package.
func (a *App) GetProductionQuantity(activeWorkspace workspaces.Workspace) (string, error) {
	//activeWorkspace := a.GetActiveWorkspace()
	return workspaces.GetProductionQuantity(activeWorkspace) // Delegate to workspaces package
}
*/
// SetProductionQuantity sets the selected production quantity by updating BOMulus.bmls.
func (a *App) SetProductionQuantity(activeWorkspace workspaces.Workspace, productionQuantity string) error {
	config.PRODUCTION_QUANTITY = productionQuantity
	return workspaces.SetProductionQuantity(activeWorkspace, productionQuantity)
}

// GetApiPriority retrieves the user API priority by delegating to workspaces package.
/*
func (a *App) GetApiPriority() ([]string, error) {
	return workspaces.GetApiPriority() // Delegate to workspaces package
}
*/
// SetApiPriority sets the user api priority by updating BOMulus.bmls.
func (a *App) SetApiPriority(priority []string) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, false, false, -1, priority)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.API_PRIORITY = priority
	return nil
}

// GetAnalysisRefreshDays retrieves the analysis refresh days by delegating to workspaces package.
func (a *App) GetAnalysisRefreshDays() (int, error) {
	return workspaces.GetAnalysisRefreshDays() // Delegate to workspaces package
}

// SetAnalysisRefreshDays sets the analysis refresh days by updating BOMulus.bmls.
func (a *App) SetAnalysisRefreshDays(refreshDays int) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, false, false, refreshDays, nil)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYSIS_REFRESH_DAYS = refreshDays
	return nil
}

/*╚══════════════════════════════════════════════╝*/
