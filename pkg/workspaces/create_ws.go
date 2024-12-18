/*
* Package: workspaces
* File: create_ws.go
*
* Description:
* This file contains the CreateWorkspace function, which is responsible for
* creating a new workspace at the specified path with the given name.
* It initializes the workspace directory and creates an associated .bmls file
* to store workspace information.
*
* Main Function:
* - CreateWorkspace: Creates a new workspace at the specified path with the given name.
*
* Input:
* - path (string): The directory path where the new workspace will be created.
* - name (string): The name of the new workspace, which will also determine
*   the name of the associated .bmls file.
*
* Output:
* - Returns an error if the workspace creation fails; otherwise, it returns nil.
*
* Note:
* This function ensures that the specified path is valid and that necessary
* permissions are granted for creating directories and files. It also updates
* the BOMulus.bmls file with the newly created workspace information.
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
	err = UpdateBOMulusFile(workspaceInfos, APIKeys{}, true, true, 3, []string{"Digikey", "Mouser", "BOMulus"})
	if err != nil {
		return fmt.Errorf("failed to update BOMulus.bmls: %w", err)
	}
	return nil
}
