package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// updateBOMulusFile updates the BOMulus.bmls file with new workspace info
func UpdateBOMulusFile(newWorkspace Workspace, apiKeys APIKeys, analyzeSaveState, saveStateMustChange bool, analysisRefreshDays int) error {
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
	if newWorkspace.WorkspaceInfos != (WorkspaceInfos{}) {
		bomulusFile.Workspaces = append(bomulusFile.Workspaces, newWorkspace)
	}

	if apiKeys != (APIKeys{}) {
		if apiKeys.BOMulusApiKey != "" {
			bomulusFile.ApiKeys.BOMulusApiKey = apiKeys.BOMulusApiKey
		}
		if apiKeys.MouserApiKey != "" {
			bomulusFile.ApiKeys.MouserApiKey = apiKeys.MouserApiKey
		}
	}
	if saveStateMustChange {
		bomulusFile.AnalyzeSaveState = analyzeSaveState
	}

	if analysisRefreshDays != -1 {
		bomulusFile.AnalysisRefreshDays = analysisRefreshDays
	}

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

func UpdateBMLSComponents(analyzedComponent core.Component) error {
	if ActiveWorkspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}

	bmlsFilePath := filepath.Join(ActiveWorkspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(ActiveWorkspacePath), " ", "_")))

	var workspace Workspace

	// Lire le fichier .bmls
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return fmt.Errorf("failed to read .bmls file: %w", err)
	}

	// Unmarshal le contenu JSON
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}

	for i := range workspace.Files {
		for j := range workspace.Files[i].Components {
			if workspace.Files[i].Components[j].Mpn == analyzedComponent.Mpn {
				workspace.Files[i].Components[j] = analyzedComponent
			}
		}
	}

	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}

	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}
