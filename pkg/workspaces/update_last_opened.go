/*
* Package: workspaces
* File: update_last_opened.go
*
* Description:
* This file contains a function for updating the "last opened" timestamp
* for workspaces in BOMulus. It updates this information both in the root
* BOMulus.bmls file and in the individual workspace's .bmls file.
*
* Main Function:
* - UpdateLastOpened: Updates the last opened timestamp for the active workspace
*   in both the root BOMulus.bmls file and the workspace's specific .bmls file.
*
* Input:
* - None directly, but relies on the global ActiveWorkspacePath variable.
*
* Output:
* - error: Returns nil if the update is successful, or an error describing the issue
*   if there are any problems during the update process.
*
* Note:
* This function assumes that an active workspace is set (ActiveWorkspacePath is not empty).
* It reads and writes JSON files, so it requires appropriate file permissions.
* The function updates timestamps to the current time when called.
 */

package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func UpdateLastOpened() error {
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
			bomulusFile.Workspaces[i].WorkspaceInfos.LastOpened = time.Now()
		}
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
	// Update the workspace bmls
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
	workspace.WorkspaceInfos.LastOpened = time.Now()
	jsonData, err = json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}
