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
