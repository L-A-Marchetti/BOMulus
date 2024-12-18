/*
* Package: workspaces
* File: update_config.go
*
* Description:
* This file contains the UpdateBOMulusFile function, which is responsible for
* updating the BOMulus.bmls file with new workspace information, API keys, and
* analysis settings.
*
* Main Function:
* - UpdateBOMulusFile: Updates the BOMulus.bmls file with new workspace info and settings.
*
* Input:
* - newWorkspace (Workspace): The workspace information to be added to the BOMulus file.
* - apiKeys (APIKeys): The API keys to be updated in the BOMulus file.
* - analyzeSaveState (bool): The state indicating whether to save analysis results.
* - saveStateMustChange (bool): A flag indicating if the save state must change.
* - analysisRefreshDays (int): The number of days for analysis refresh settings.
*
* Output:
* - Returns an error if file operations fail; otherwise, returns nil.
*
* Note:
* This function reads the existing BOMulus.bmls file if it exists, updates its contents,
* and writes the changes back to the file. Ensure that the application has permission
* to read and write files in the specified directory.
 */

package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// UpdateBOMulusFile updates the BOMulus.bmls file with new workspace info.
// This function reads the existing BOMulus.bmls file, updates it with the new workspace,
// API keys, and other settings, and then writes the updated data back to the file.
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
	// Add new workspace to the list if it's valid
	if newWorkspace.WorkspaceInfos != (WorkspaceInfos{}) {
		bomulusFile.Workspaces = append(bomulusFile.Workspaces, newWorkspace)
	}
	// Update API keys if provided
	if apiKeys != (APIKeys{}) {
		if apiKeys.BOMulusApiKey != "" {
			bomulusFile.ApiKeys.BOMulusApiKey = apiKeys.BOMulusApiKey
		}
		if apiKeys.MouserApiKey != "" {
			bomulusFile.ApiKeys.MouserApiKey = apiKeys.MouserApiKey
		}
		if apiKeys.DKClientId != "" && apiKeys.DKSecret != "" {
			bomulusFile.ApiKeys.DKClientId = apiKeys.DKClientId
			bomulusFile.ApiKeys.DKSecret = apiKeys.DKSecret
		}
	}
	// Update save state if required
	if saveStateMustChange {
		bomulusFile.AnalyzeSaveState = analyzeSaveState
	}
	// Update analysis refresh days if specified
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
