package workspaces

import (
	"core"
	"sync"
	"time"
)

type WorkspaceInfos struct {
	Name       string    `json:"name"`
	Path       string    `json:"path"`
	CreatedAt  time.Time `json:"createdAt"`
	LastOpened time.Time `json:"last_opened"`
}

type Workspace struct {
	WorkspaceInfos WorkspaceInfos `json:"workspace_infos"`
	Files          []FileInfo     `json:"files"`
}

type BOMulusFile struct {
	Workspaces          []Workspace `json:"workspaces"`
	ApiKeys             APIKeys     `json:"api_keys"`
	AnalyzeSaveState    bool        `json:"analyze_save_state"`
	AnalysisRefreshDays int         `json:"analysis_refresh_days"`
	ApiPriority         []string    `json:"api_priority"`
}

type FileInfo struct {
	Name       string           `json:"name"`
	Path       string           `json:"path"`
	Components []core.Component `json:"components"`
	Filters    core.Filter      `json:"filters"`
}

type APIKeys struct {
	MouserApiKey  string `json:"mouser_api_key"`
	BOMulusApiKey string `json:"bomulus_api_key"`
	DKClientId    string `json:"dk_client_id"`
	DKSecret      string `json:"dk_secret"`
}

var API_KEYS = APIKeys{
	BOMulusApiKey: "",
	MouserApiKey:  "",
	DKClientId:    "",
	DKSecret:      "",
}

var (
	ActiveWorkspacePath  string
	ActiveWorkspaceMutex sync.RWMutex
)
