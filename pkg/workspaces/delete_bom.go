/*
* Package: workspaces
* File: delete_bom.go
*
* Description:
* This file contains a function for deleting a BOM file
* from an active workspace. It updates the workspace's .bmls configuration file
* to remove the reference to the deleted BOM file and also removes the physical
* file from the filesystem.
*
* Main Function:
* - DeleteBOMFile: Removes a specified BOM file from the active workspace's
*   configuration and deletes the corresponding file from the filesystem.
*
* Input:
* - filePath (string): The file path of the BOM file to be deleted. This should
*   correspond to the file's path in the workspace configuration and on the filesystem.
*
* Output:
* - error: Returns nil if the BOM file is successfully deleted, or an error
*   describing the issue if there are any problems during the deletion process,
*   such as no active workspace set, reading or writing the .bmls file,
*   or removing the physical file.
*
* Note:
* This function assumes that ActiveWorkspacePath is correctly set and that
* the .bmls file for the active workspace exists and is properly formatted.
* It also assumes that the specified BOM file exists both in the configuration
* and on the filesystem.
 */

package workspaces

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func DeleteBOMFile(filePath string) error {
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
	for i, file := range workspace.Files {
		if file.Path == filePath {
			// Delete the workspace
			if i == len(workspace.Files)-1 {
				workspace.Files = workspace.Files[:i]
			} else {
				workspace.Files = append(workspace.Files[:i], workspace.Files[i+1:]...)
			}
			break
		}
	}
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	err = os.WriteFile(bmlsFilePath, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write BOMulus.bmls: %w", err)
	}
	// Remove the xl file.
	err = os.RemoveAll(filePath)
	if err != nil {
		return fmt.Errorf("failed to delete the BOM file %s: %w", filePath, err)
	}
	return nil
}
