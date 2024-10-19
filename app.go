package main

import (
	"components"
	"config"
	"context"
	"core"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/skratchdot/open-golang/open"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/time/rate"
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

// DisplayFileName returns file information with validation status
func (a *App) DisplayFileName(fileName string) struct {
	File  string
	Color string
} {
	if core.HasValidExtension(fileName) {
		return struct {
			File  string
			Color string
		}{
			File:  fmt.Sprintf("☑ %s", fileName),
			Color: "valid",
		}
	}
	return struct {
		File  string
		Color string
	}{
		File:  "☒ file not valid...",
		Color: "invalid",
	}
}

func (a *App) UploadFile(name string, content []byte, idx int) error {
	filePath := filepath.Join("./tmp", name)
	core.XlsmFiles[idx-1].Path = filePath

	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error creating the file: %w", err)
	}
	defer file.Close()

	_, err = file.Write(content)
	if err != nil {
		return fmt.Errorf("error writing the file: %w", err)
	}
	return nil
}

func (a *App) BtnCompare() {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.BtnCompare()", true).Stop()
	}
	core.XlsmReader()
	components.HeaderDetection()
	components.ComponentsDetection()
	core.XlsmDiff()
	core.ResetAnalysisStatus()
}

/*
	func (a *App) ResizeWindow(width, height int) {
		runtime.WindowSetSize(a.ctx, width, height)
	}
*/
func (a *App) GetAnalysisState() core.AnalysisStatus {
	return core.AnalysisState
}

func (a *App) RunAnalysis() {
	core.AnalysisState.Total = 100
	core.AnalysisState.IdxStart = 0
	core.AnalysisState.IdxEnd = 99
	go func() { // Run in a goroutine
		totalComponents := core.AnalysisState.Total
		limiter := rate.NewLimiter(rate.Every(2*time.Second), 1)
		for i := core.AnalysisState.IdxStart; i <= core.AnalysisState.IdxEnd; i++ {
			err := limiter.Wait(context.Background())
			if err != nil {
				log.Print(err)
				continue
			}
			components.APIRequest(i)
			fmt.Println(core.Components[i])
			core.AnalysisState.Current += 1
			core.AnalysisState.Progress = float64(core.AnalysisState.Current) / float64(totalComponents) * 100 // Update progress to percentage
		}

		core.AnalysisState.InProgress = false
		core.AnalysisState.Completed = true
	}()
}

func (a *App) OpenExternalLink(s string) {
	err := open.Run(s)
	core.ErrorsHandler(err)
}

func (a *App) MinimizeWindow() {
	runtime.WindowMinimise(a.ctx)
}

func (a *App) MaximizeWindow() {
	runtime.WindowToggleMaximise(a.ctx)
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

type WorkspaceInfos struct {
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	CreatedAt time.Time `json:"createdAt"`
}

type Workspace struct {
	WorkspaceInfos WorkspaceInfos `json:"workspace_infos"`
}

type BOMulusFile struct {
	Workspaces []Workspace `json:"workspaces"`
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
	workspaceInfos := Workspace{
		WorkspaceInfos: WorkspaceInfos{
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
	err = updateBOMulusFile(workspaceInfos)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}

	return nil
}

// updateBOMulusFile updates the BOMulus.bmls file with new workspace info
func updateBOMulusFile(newWorkspace Workspace) error {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile BOMulusFile

	// Read existing BOMulus.bmls file if it exists
	if _, err := os.Stat(bomulusPath); err == nil {
		data, err := os.ReadFile(bomulusPath)
		if err != nil {
			return fmt.Errorf("failed to read BOMulus.bmls: %w", err)
		}

		err = json.Unmarshal(data, &bomulusFile)
		if err != nil {
			return fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
		}
	}

	// Add new workspace to the list
	bomulusFile.Workspaces = append(bomulusFile.Workspaces, newWorkspace)

	// Write updated data back to BOMulus.bmls
	jsonData, err := json.MarshalIndent(bomulusFile, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal BOMulus file: %w", err)
	}

	err = os.WriteFile(bomulusPath, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write BOMulus.bmls: %w", err)
	}

	return nil
}
