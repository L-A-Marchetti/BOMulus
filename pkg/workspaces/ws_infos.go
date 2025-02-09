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
	"strings"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
func UpdateVersionTags(files []FileInfo) error {
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
func UpdateLastComparison(v1, v2 string) error {
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
func GetLastComparison() (Comparison, error) {
	if ActiveWorkspacePath == "" {
		return Comparison{}, fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(ActiveWorkspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(ActiveWorkspacePath), " ", "_")))
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

func GetRecentWorkspaces() ([]Workspace, error) {
	db, err := gorm.Open(sqlite.Open("./config.bmls"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	var workspaces []Workspace
	if err := db.Order("last_opened desc").Limit(6).Find(&workspaces).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve recent workspaces: %w", err)
	}
	return workspaces, nil
}
