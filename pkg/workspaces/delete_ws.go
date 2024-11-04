/*
* Package: workspaces
* File: delete_ws.go
*
* Description:
* This file contains a function for deleting a workspace from the BOMulus
* configuration file and removing the corresponding directory from the filesystem.
* It updates the BOMulus file to reflect the removal of the workspace and
* ensures that all associated data is cleaned up.
*
* Main Function:
* - DeleteWorkspace: Deletes the specified workspace from the BOMulus file
*   and removes the associated directory from the filesystem.
*
* Input:
* - path (string): The file path of the workspace to be deleted. This should
*   correspond to the workspace's directory in the filesystem as well as its
*   entry in the BOMulus configuration.
*
* Output:
* - error: Returns nil if the workspace is successfully deleted, or an error
*   describing the issue if there are any problems during the deletion process,
*   such as reading or writing the BOMulus file, or removing the directory.
*
* Note:
* This function assumes that the BOMulus configuration file is correctly formatted
* and that the specified workspace exists in both the configuration and on disk.
 */

package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func DeleteWorkspace(path string) error {
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
		if workspace.WorkspaceInfos.Path == path {
			// Delete the workspace
			if i == len(bomulusFile.Workspaces)-1 {
				bomulusFile.Workspaces = bomulusFile.Workspaces[:i]
			} else {
				bomulusFile.Workspaces = append(bomulusFile.Workspaces[:i], bomulusFile.Workspaces[i+1:]...)
			}
			break
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
	// Remove the workspace folder.
	err = os.RemoveAll(path)
	if err != nil {
		return fmt.Errorf("failed to delete directory %s: %w", path, err)
	}
	return nil
}
