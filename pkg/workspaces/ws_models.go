package workspaces

import (
	"core"
	"time"
)

type WorkspaceInfos struct {
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	CreatedAt time.Time `json:"createdAt"`
}

type Workspace struct {
	WorkspaceInfos WorkspaceInfos `json:"workspace_infos"`
	Files          []FileInfo     `json:"files"`
}

type BOMulusFile struct {
	Workspaces []Workspace `json:"workspaces"`
	ApiKeys    APIKeys     `json:"api_keys"`
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
}
