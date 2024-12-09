package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func UpdateDesignator(d core.Designator) error {
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
			for k := range workspace.Files[i].Components[j].Designators {
				if workspace.Files[i].Components[j].Designators[k].Designator == d.Designator {
					workspace.Files[i].Components[j].Designators[k].Label = d.Label
				}
			}
		}
	}
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}
