/*
* Package: workspaces
* File: update_components.go
*
* Description:
* This file contains the UpdateBMLSComponents function, which is responsible for
* updating the .bmls file associated with the active workspace. It modifies the
* components within the .bmls file based on the analyzed component provided.
*
* Main Function:
* - UpdateBMLSComponents: Updates the .bmls file with information about an analyzed component.
*
* Input:
* - analyzedComponent (core.Component): The component that has been analyzed and needs to be updated
*   in the .bmls file.
*
* Output:
* - Returns an error if the active workspace is not set or if file operations fail; otherwise, returns nil.
*
* Note:
* Ensure that the active workspace path is set before calling this function. This function modifies
* the existing .bmls file by replacing components that match the provided analyzed component.
 */

package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// UpdateBMLSComponents updates the .bmls file with information about analyzed components.
// This function searches for a component in the current workspace's .bmls file and updates
// it with the provided analyzed component if a match is found.
func UpdateBMLSComponents(analyzedComponent core.Component) error {
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
	for i := range workspace.Files {
		for j := range workspace.Files[i].Components {
			if workspace.Files[i].Components[j].Mpn == analyzedComponent.Mpn {
				// Create a new component without the Quantity field
				updatedComponent := analyzedComponent
				updatedComponent.Quantity = workspace.Files[i].Components[j].Quantity // Preserve the original quantity
				// Update the existing component with the new values (excluding Quantity)
				workspace.Files[i].Components[j] = updatedComponent
			}
		}
	}
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}
