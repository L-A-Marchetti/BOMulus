package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// updateBOMulusFile updates the BOMulus.bmls file with new workspace info
func UpdateBOMulusFile(newWorkspace Workspace, apiKeys APIKeys, analyzeSaveState, saveStateMustChange bool) error {
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
