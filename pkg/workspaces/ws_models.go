package workspaces

import (
	"core"
	"sync"
	"time"

	"github.com/lib/pq"
)

type WorkspaceInfos struct {
	Name               string     `json:"name"`
	Path               string     `json:"path"`
	CreatedAt          time.Time  `json:"createdAt"`
	LastOpened         time.Time  `json:"last_opened"`
	ProductionQuantity string     `json:"production_quantity"`
	LastComparison     Comparison `json:"last_comparison" gorm:"embedded"`
}

type Comparison struct {
	V1 string `json:"v1"`
	V2 string `json:"v2"`
}

type Workspace struct {
	ID             uint `gorm:"primaryKey"`
	BOMulusFileID  uint
	WorkspaceInfos WorkspaceInfos `json:"workspace_infos" gorm:"embedded"`
	Files          []FileInfo     `json:"files" gorm:"foreignKey:WorkspaceID"`
}

type BOMulusFile struct {
	ID                  uint           `gorm:"primaryKey"`
	Workspaces          []Workspace    `json:"workspaces" gorm:"foreignKey:BOMulusFileID"`
	ApiKeys             APIKeys        `json:"api_keys" gorm:"embedded"`
	AnalyzeSaveState    bool           `json:"analyze_save_state"`
	AnalysisRefreshDays int            `json:"analysis_refresh_days"`
	ApiPriority         pq.StringArray `json:"api_priority" gorm:"type:text[]"`
}

type FileInfo struct {
	ID          uint `gorm:"primaryKey"`
	WorkspaceID uint
	VersionTag  int              `json:"version_tag"`
	Name        string           `json:"name"`
	Path        string           `json:"path"`
	Components  []core.Component `json:"components" gorm:"-"`
	Filters     core.Filter      `json:"filters" gorm:"-"`
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
