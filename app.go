package main

import (
	"components"
	"config"
	"context"
	"core"
	"fmt"
	"log"
	"os"
	"path/filepath"
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
