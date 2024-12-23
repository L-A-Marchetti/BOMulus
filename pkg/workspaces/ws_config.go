/*
* Package: workspaces
* File: ws_config.go
*
* Description:
* This file contains functions for retrieving various settings and API keys
* from the BOMulus.bmls file associated with the workspace. It provides
* functionalities to get the analysis save state, analysis refresh days,
* and saved API keys.
*
* Main Functions:
* - GetAnalyzeSaveState: Retrieves the analyze save state from the BOMulus.bmls file.
* - GetAnalysisRefreshDays: Retrieves the analysis refresh days from the BOMulus.bmls file.
* - GetSavedAPIKeys: Retrieves saved API keys from the BOMulus.bmls file.
*
* Output:
* - Each function returns an error if file operations fail; otherwise,
*   it returns the requested data.
*
* Note:
* Ensure that the BOMulus.bmls file exists and is accessible. These functions
* assume that the structure of the BOMulus.bmls file matches the expected format.
 */

package workspaces

import (
	"config"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// GetAnalyzeSaveState retrieves the analyze save state from the BOMulus.bmls file.
// It reads the BOMulus.bmls file, unmarshals its content, and updates the
// global configuration with the analyze save state value.
func GetAnalyzeSaveState() (bool, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")
	var bomulusFile BOMulusFile
	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return false, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}
	// Unmarshal JSON data into bomulusFile structure
	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}
	// Update global configuration with analyze save state
	config.ANALYZE_SAVE_STATE = bomulusFile.AnalyzeSaveState
	return bomulusFile.AnalyzeSaveState, nil
}

// GetProductionQuantity retrieves the production quantity in the specified .bmls file.
// It reads the .bmls file, unmarshals its content, and updates the
// global configuration with the production quantity value.
func GetProductionQuantity(workspacePath string) (string, error) {
	if workspacePath == "" {
		return "", fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	config.PRODUCTION_QUANTITY = workspace.WorkspaceInfos.ProductionQuantity
	return workspace.WorkspaceInfos.ProductionQuantity, nil
}

// SetProductionQuantity update the production quantity in the specified .bmls file.
// It reads the .bmls file, unmarshals its content, and updates the
// global configuration with the production quantity value.
func SetProductionQuantity(productionQuantity string) error {
	if ActiveWorkspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(ActiveWorkspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(ActiveWorkspacePath), " ", "_")))
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal the JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	workspace.WorkspaceInfos.ProductionQuantity = productionQuantity
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	if ActiveWorkspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}
	// Update the root BOMulus file
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
	for i, workspace := range bomulusFile.Workspaces {
		if workspace.WorkspaceInfos.Path == ActiveWorkspacePath {
			bomulusFile.Workspaces[i].WorkspaceInfos.ProductionQuantity = productionQuantity
			break
		}
	}
	// Write updated data back to BOMulus.bmls
	jsonDataRoot, err := json.MarshalIndent(bomulusFile, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal BOMulus file: %w", err)
	}
	err = os.WriteFile(bomulusPath, jsonDataRoot, 0644)
	if err != nil {
		return fmt.Errorf("failed to write BOMulus.bmls: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

// GetApiPriority retrieves the user api priority from the BOMulus.bmls file.
// It reads the BOMulus.bmls file, unmarshals its content, and updates the
// global configuration with the api priority array.
func GetApiPriority() ([]string, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")
	var bomulusFile BOMulusFile
	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}
	// Unmarshal JSON data into bomulusFile structure
	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}
	// Update global configuration with api priority
	config.API_PRIORITY = bomulusFile.ApiPriority
	return bomulusFile.ApiPriority, nil
}

// GetAnalysisRefreshDays retrieves the analysis refresh days from the BOMulus.bmls file.
// It reads the BOMulus.bmls file, unmarshals its content, and updates the
// global configuration with the analysis refresh days value.
func GetAnalysisRefreshDays() (int, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")
	var bomulusFile BOMulusFile
	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return -1, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}
	// Unmarshal JSON data into bomulusFile structure
	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return -1, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}
	// Update global configuration with analysis refresh days
	config.ANALYSIS_REFRESH_DAYS = bomulusFile.AnalysisRefreshDays
	return bomulusFile.AnalysisRefreshDays, nil
}

// GetSavedAPIKeys retrieves saved API keys from the BOMulus.bmls file.
// It reads the BOMulus.bmls file and unmarshals its content to extract
// API keys for further use in the application.
func GetSavedAPIKeys() (APIKeys, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")
	var bomulusFile BOMulusFile
	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return APIKeys{}, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}
	// Unmarshal JSON data into bomulusFile structure
	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return APIKeys{}, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}
	// Create API_KEYS structure with values from bomulusFile
	API_KEYS = APIKeys{
		BOMulusApiKey: bomulusFile.ApiKeys.BOMulusApiKey,
		MouserApiKey:  bomulusFile.ApiKeys.MouserApiKey,
		DKClientId:    bomulusFile.ApiKeys.DKClientId,
		DKSecret:      bomulusFile.ApiKeys.DKSecret,
	}
	return bomulusFile.ApiKeys, nil
}
