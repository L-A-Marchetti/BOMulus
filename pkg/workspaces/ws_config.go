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
	}
	return bomulusFile.ApiKeys, nil
}
