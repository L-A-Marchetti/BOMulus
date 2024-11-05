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
