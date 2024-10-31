package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
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

// CreateWorkspace creates a new workspace at the specified path with the given name.
func CreateWorkspace(path string, name string) error {
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
	err = UpdateBOMulusFile(workspaceInfos, APIKeys{}, true, true, 3)
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}

	return nil
}

// GetRecentWorkspaces returns the 3 most recently created workspaces.
func GetRecentWorkspaces() ([]Workspace, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	// Sort workspaces by creation date (most recent first)
	sort.Slice(bomulusFile.Workspaces, func(i, j int) bool {
		return bomulusFile.Workspaces[i].WorkspaceInfos.CreatedAt.After(bomulusFile.Workspaces[j].WorkspaceInfos.CreatedAt)
	})

	// Return up to 3 most recent workspaces
	if len(bomulusFile.Workspaces) > 3 {
		return bomulusFile.Workspaces[:3], nil
	}
	return bomulusFile.Workspaces, nil
}

// GetSavedAPIKeys retrieves saved API keys from the BOMulus.bmls file.
func GetSavedAPIKeys() (APIKeys, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return APIKeys{}, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return APIKeys{}, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	API_KEYS = APIKeys{
		BOMulusApiKey: bomulusFile.ApiKeys.BOMulusApiKey,
		MouserApiKey:  bomulusFile.ApiKeys.MouserApiKey,
	}

	return bomulusFile.ApiKeys, nil
}

// AddFileToWorkspace copies a file to the specified workspace directory and updates the .bmls file.
func AddFileToWorkspace(workspacePath string, filePath string) error {
	if workspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}

	fileName := filepath.Base(filePath)
	destPath := filepath.Join(workspacePath, fileName)

	// Open the source file
	srcFile, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("error opening source file: %w", err)
	}
	defer srcFile.Close()

	// Create the destination file
	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("error creating destination file: %w", err)
	}
	defer destFile.Close()

	// Copy the content of the file
	_, err = io.Copy(destFile, srcFile)
	if err != nil {
		return fmt.Errorf("error copying file: %w", err)
	}

	// Update the .bmls file with the new file information
	return UpdateBMLSWithNewFile(workspacePath, fileName, destPath)
}

// updateBMLSWithNewFile updates the .bmls file with information about the newly added file.
func UpdateBMLSWithNewFile(workspacePath, fileName, filePath string) error {
	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))

	var workspace Workspace

	// Read the existing .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err == nil {
		err = json.Unmarshal(data, &workspace)
		if err != nil {
			return fmt.Errorf("failed to unmarshal .bmls: %w", err)
		}
	}
	components, filters := FileProcessing(filePath) // Assuming this function is defined elsewhere

	// Add information about the new file
	workspace.Files = append(workspace.Files, FileInfo{
		Name:       fileName,
		Path:       filePath,
		Components: components,
		Filters:    filters,
	})
	// Write updated data to the .bmls file
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}

	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

// GetFilesInWorkspaceInfo returns the list of files in the specified workspace's .bmls file.
func GetFilesInWorkspaceInfo(workspacePath string) ([]FileInfo, error) {
	if workspacePath == "" {
		return nil, fmt.Errorf("no active workspace set")
	}

	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))

	var workspace Workspace

	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read .bmls file: %w", err)
	}

	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}

	return workspace.Files, nil
}

// GetAnalyzeSaveState retrieves the analyze save state from the BOMulus.bmls file.
func GetAnalyzeSaveState() (bool, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return false, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	return bomulusFile.AnalyzeSaveState, nil
}

// GetAnalysisRefreshDays retrieves the analysis refresh days from the BOMulus.bmls file.
func GetAnalysisRefreshDays() (int, error) {
	bomulusPath := filepath.Join("./", "BOMulus.bmls")

	var bomulusFile BOMulusFile

	// Read BOMulus.bmls file
	data, err := os.ReadFile(bomulusPath)
	if err != nil {
		return -1, fmt.Errorf("failed to read BOMulus.bmls: %w", err)
	}

	err = json.Unmarshal(data, &bomulusFile)
	if err != nil {
		return -1, fmt.Errorf("failed to unmarshal BOMulus.bmls: %w", err)
	}

	return bomulusFile.AnalysisRefreshDays, nil
}

func FileProcessing(filePath string) ([]core.Component, core.Filter) {
	file := core.XlsmFile{
		Path: filePath,
	}
	core.XlsmReader(&file)
	core.HeaderDetection(&file)
	core.ComponentsDetection(&file)
	return file.Components, file.Filters
}
