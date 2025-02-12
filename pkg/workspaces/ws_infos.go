/*
* Package: workspaces
* File: ws_infos.go
*
* Description:
* This file contains functions for retrieving information about files and workspaces
* associated with the application. It provides functionalities to get the list of files
* in a specified workspace's .bmls file and to retrieve the most recently created workspaces.
*
* Main Functions:
* - GetFilesInWorkspaceInfo: Returns the list of files in the specified workspace's .bmls file.
* - GetRecentWorkspaces: Returns the three most recently created workspaces.
*
* Input:
* - GetFilesInWorkspaceInfo:
*   - workspacePath (string): The path of the workspace whose files are to be retrieved.
*
* - GetRecentWorkspaces:
*   - None
*
* Output:
* - GetFilesInWorkspaceInfo: Returns a slice of FileInfo and an error if file operations fail.
* - GetRecentWorkspaces: Returns a slice of Workspace and an error if file operations fail.
*
* Note:
* Ensure that the specified paths are valid and that necessary permissions are granted
* for reading files. The functions assume that the .bmls files are structured correctly.
 */

package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// GetFilesInWorkspaceInfo returns the list of files in the specified workspace's .bmls file.
func GetFilesInWorkspaceInfo(activeWorkspace Workspace) ([]FileInfo, error) {
	if activeWorkspace.WorkspaceInfos.Path == "" {
		return nil, fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(activeWorkspace.WorkspaceInfos.Path, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(activeWorkspace.WorkspaceInfos.Path), " ", "_")))
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

// GetWorkspaceInfo returns infos from a specified workspace's .bmls file.
func GetWorkspaceInfo(workspacePath string) (WorkspaceInfos, error) {
	if workspacePath == "" {
		return WorkspaceInfos{}, fmt.Errorf("no active workspace set")
	}
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(workspacePath)
	if err != nil {
		return WorkspaceInfos{}, fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return WorkspaceInfos{}, fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	return workspace.WorkspaceInfos, nil
}

// UpdateVersionTags update the version tag of each file in the workspace's .bmls file.
func UpdateVersionTags(activeWorkspace string, files []FileInfo) error {
	if activeWorkspace == "" {
		return fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(activeWorkspace, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(activeWorkspace), " ", "_")))
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	for i := range files {
		for j := range workspace.Files {
			if files[i].Path == workspace.Files[j].Path {
				workspace.Files[j].VersionTag = files[i].VersionTag
			}
		}
	}
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

// UpdateLastComparison update the last comparison the workspace's .bmls file.
func UpdateLastComparison(activeWorkspace, v1, v2 string) error {
	if activeWorkspace == "" {
		return fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(activeWorkspace, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(activeWorkspace), " ", "_")))
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	workspace.WorkspaceInfos.LastComparison.V1 = v1
	workspace.WorkspaceInfos.LastComparison.V2 = v2
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

// GetLastComparison get the last comparison from workspace's .bmls file.
func GetLastComparison(activeWorkspace string) (Comparison, error) {
	if activeWorkspace == "" {
		return Comparison{}, fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(activeWorkspace, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(activeWorkspace), " ", "_")))
	var workspace Workspace
	// Read the .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err != nil {
		return Comparison{}, fmt.Errorf("failed to read .bmls file: %w", err)
	}
	// Unmarshal JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return Comparison{}, fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	return workspace.WorkspaceInfos.LastComparison, nil
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
		return bomulusFile.Workspaces[i].WorkspaceInfos.LastOpened.After(bomulusFile.Workspaces[j].WorkspaceInfos.LastOpened)
	})
	// Return up to 3 most recent workspaces
	if len(bomulusFile.Workspaces) > 6 {
		return bomulusFile.Workspaces[:6], nil
	}
	return bomulusFile.Workspaces, nil
}
