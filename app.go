package main

import (
	"components"
	"config"
	"context"
	"core"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
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

func (a *App) GetComponents() []core.Component {
	return core.Components
}

func (a *App) GetComponent(i int) core.Component {
	return core.Components[i]
}

func (a *App) BtnCompare(v1, v2 []core.Component) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.BtnCompare()", true).Stop()
	}
	core.ResetComponents()
	core.XlsmDiff(v1, v2)
	core.ResetAnalysisStatus()
}

func ComponentDetection(filePath string) ([]core.Component, core.Filter) {
	file := core.XlsmFile{
		Path: filePath,
	}
	core.XlsmReader(&file)
	components.HeaderDetection(&file)
	components.ComponentsDetection(&file)
	return file.Components, file.Filters
}

func (a *App) GetAnalysisState() core.AnalysisStatus {
	return core.AnalysisState
}

// RunAnalysis initiates the analysis of components by calling the AnalyzeComponents function.
func (a *App) RunAnalysis() error {
	return components.AnalyzeComponents() // Delegate analysis to the components package
}

func (a *App) OpenExternalLink(s string) {
	err := open.Run(s)
	core.ErrorsHandler(err)
}

func (a *App) MinimizeWindow() {
	runtime.WindowMinimise(a.ctx)
}
func (a *App) MaximizeWindow() {
	isMaximised := runtime.WindowIsMaximised(a.ctx)
	if !isMaximised {
		runtime.WindowMaximise(a.ctx)
	}
}

func (a *App) CloseWindow() {
	runtime.Quit(a.ctx)
}

// OpenDirectoryDialog opens a directory selection dialog
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

// SetActiveWorkspace sets the active workspace path
func (a *App) SetActiveWorkspace(path string) {
	workspaces.ActiveWorkspaceMutex.Lock()
	defer workspaces.ActiveWorkspaceMutex.Unlock()
	workspaces.ActiveWorkspacePath = path
}

// GetActiveWorkspace returns the active workspace path
func (a *App) GetActiveWorkspace() string {
	workspaces.ActiveWorkspaceMutex.RLock()
	defer workspaces.ActiveWorkspaceMutex.RUnlock()
	return workspaces.ActiveWorkspacePath
}

// CreateWorkspace creates a new workspace
func (a *App) CreateWorkspace(path string, name string) error {
	fullPath := filepath.Join(path, name)

	// Create the workspace directory
	err := os.MkdirAll(fullPath, 0755)
	if err != nil {
		return fmt.Errorf("failed to create workspace directory: %w", err)
	}

	// Format the bmls name file
	formattedName := strings.ReplaceAll(name, " ", "_")
	bmlsFile := fmt.Sprintf("%s.bmls", formattedName)
	bmlsFilePath := filepath.Join(fullPath, bmlsFile)

	// Create the workspace info
	workspaceInfos := workspaces.Workspace{
		WorkspaceInfos: workspaces.WorkspaceInfos{
			Name:      name,
			Path:      fullPath,
			CreatedAt: time.Now(),
		},
	}

	// Convert workspace info to JSON
	jsonData, err := json.MarshalIndent(workspaceInfos, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal workspace info: %w", err)
	}

	// Write JSON data to the .bmls file
	err = os.WriteFile(bmlsFilePath, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write .bmls file: %w", err)
	}

	// Update BOMulus.bmls
	err = workspaces.UpdateBOMulusFile(workspaceInfos, workspaces.APIKeys{}, true, true, 3)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}

	return nil
}

// GetRecentWorkspaces returns the 3 most recently created workspaces
func (a *App) GetRecentWorkspaces() ([]workspaces.Workspace, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile workspaces.BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	// Sort workspaces by creation date (most recent first)
	sort.Slice(bomulusFile.Workspaces, func(i, j int) bool {
		return bomulusFile.Workspaces[i].WorkspaceInfos.CreatedAt.After(bomulusFile.Workspaces[j].WorkspaceInfos.CreatedAt)
	})

	// Return up to 3 most recent workspaces
	if len(bomulusFile.Workspaces) > 3 {
		return bomulusFile.Workspaces[:3], nil
	}
	return bomulusFile.Workspaces, nil
}

func (a *App) GetSavedAPIKeys() (workspaces.APIKeys, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile workspaces.BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return workspaces.APIKeys{}, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return workspaces.APIKeys{}, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	workspaces.API_KEYS = workspaces.APIKeys{
		BOMulusApiKey: bomulusFile.ApiKeys.BOMulusApiKey,
		MouserApiKey:  bomulusFile.ApiKeys.MouserApiKey,
	}

	return bomulusFile.ApiKeys, nil
}

// OpenFileDialog opens a file selection dialog
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

// AddFileToWorkspace copies a file to the active workspace directory and updates the .bmls file
func (a *App) AddFileToWorkspace(filePath string) error {
	workspacePath := a.GetActiveWorkspace()
	if workspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}

	fileName := filepath.Base(filePath)
	destPath := filepath.Join(workspacePath, fileName)

	// Ouvrir le fichier source
	srcFile, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("error opening source file: %w", err)
	}
	defer srcFile.Close()

	// Créer le fichier de destination
	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("error creating destination file: %w", err)
	}
	defer destFile.Close()

	// Copier le contenu du fichier
	_, err = io.Copy(destFile, srcFile)
	if err != nil {
		return fmt.Errorf("error copying file: %w", err)
	}

	// Mettre à jour le fichier .bmls avec les informations du nouveau fichier
	return a.updateBMLSWithNewFile(workspacePath, fileName, destPath)
}

// updateBMLSWithNewFile met à jour le fichier .bmls avec les informations du nouveau fichier ajouté
func (a *App) updateBMLSWithNewFile(workspacePath, fileName, filePath string) error {
	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))

	var workspace workspaces.Workspace

	// Lire le fichier .bmls existant
	data, err := os.ReadFile(bmlsFilePath)
	if err == nil {
		err = json.Unmarshal(data, &workspace)
		if err != nil {
			return fmt.Errorf("failed to unmarshal .bmls: %w", err)
		}
	}
	components, filters := ComponentDetection(filePath)
	// Ajouter les informations du nouveau fichier
	workspace.Files = append(workspace.Files, workspaces.FileInfo{
		Name:       fileName,
		Path:       filePath,
		Components: components,
		Filters:    filters,
	})

	// Écrire les données mises à jour dans le fichier .bmls
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}

	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

// GetFilesInWorkspaceInfo returns the list of files in the active workspace's .bmls file
func (a *App) GetFilesInWorkspaceInfo() ([]workspaces.FileInfo, error) {
	workspacePath := a.GetActiveWorkspace()
	if workspacePath == "" {
		return nil, fmt.Errorf("no active workspace set")
	}

	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))

	var workspace workspaces.Workspace

	// Lire le fichier .bmls
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read .bmls file: %w", err)
	}

	// Unmarshal le contenu JSON
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}

	return workspace.Files, nil
}

func (a *App) PriceCalculator(quantity float64) (components.PriceCalculationResult, error) {
	return components.QuantityPrice(int(quantity))
}

func (a *App) TestMouserAPIKey(apiKey string) (bool, error) {
	err := components.TestAPIKey(apiKey, "mouser")
	if err != nil {
		return false, err
	}
	return true, nil
}

func (a *App) TestBOMulusAPIKey(apiKey string) (bool, error) {
	// Implémentez la logique de test pour l'API BOMulus
	// Retournez true si la clé API est valide, false sinon
	return true, nil
}

func (a *App) SetAnalyzeSaveState(state bool) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, state, true, -1)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYZE_SAVE_STATE = state
	return nil
}

func (a *App) GetAnalyzeSaveState() (bool, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile workspaces.BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return false, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	config.ANALYZE_SAVE_STATE = bomulusFile.AnalyzeSaveState

	return bomulusFile.AnalyzeSaveState, nil
}

func (a *App) GetAnalysisRefreshDays() (int, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile workspaces.BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return -1, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return -1, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	config.ANALYSIS_REFRESH_DAYS = bomulusFile.AnalysisRefreshDays

	return bomulusFile.AnalysisRefreshDays, nil
}

func (a *App) SetAnalysisRefreshDays(refreshDays int) error {
	err := workspaces.UpdateBOMulusFile(workspaces.Workspace{}, workspaces.APIKeys{}, false, false, refreshDays)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	config.ANALYSIS_REFRESH_DAYS = refreshDays
	return nil
}
