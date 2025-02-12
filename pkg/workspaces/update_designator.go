package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func UpdateDesignator(d core.Designator) {
	for i := range core.Components {
		for j := range core.Components[i].Designators {
			if d.Designator == core.Components[i].Designators[j].Designator {
				core.Components[i].Designators[j] = d
			}
		}
	}
}

func UpdateBMLSDesignators(activeWorkspace string) error {
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
	// Unmarshal the JSON content
	err = json.Unmarshal(data, &workspace)
	if err != nil {
		return fmt.Errorf("failed to unmarshal .bmls: %w", err)
	}
	for l := range core.Components {
		for m := range core.Components[l].Designators {
			for i := range workspace.Files {
				for j := range workspace.Files[i].Components {
					for k := range workspace.Files[i].Components[j].Designators {
						if workspace.Files[i].Components[j].Designators[k].Designator == core.Components[l].Designators[m].Designator {
							workspace.Files[i].Components[j].Designators[k] = core.Components[l].Designators[m]
						}
					}
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
