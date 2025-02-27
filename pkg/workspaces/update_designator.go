package workspaces

import (
	"core"
)

func UpdateDesignators(designators []core.Designator) {
	for i := range core.Components {
		for j := range core.Components[i].Designators {
			for _, d := range designators {
				if d.Designator == core.Components[i].Designators[j].Designator {
					core.Components[i].Designators[j] = d
				}
			}
		}
	}
}
/*
func UpdateBMLSDesignators(activeWorkspace Workspace) error {
	if activeWorkspace.WorkspaceInfos.Path == "" {
		return fmt.Errorf("no active workspace set")
	}
	bmlsFilePath := filepath.Join(activeWorkspace.WorkspaceInfos.Path, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(activeWorkspace.WorkspaceInfos.Path), " ", "_")))
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
*/

func UpdateBMLSDesignators(activeWorkspace Workspace) error {
	var files []FileInfo
	if err := Workspaces.Model(&activeWorkspace).
		Preload("Components").
		Preload("Components.Designators").
		Association("Files").Find(&files); err != nil {
		return err
	}
	for l := range core.Components {
		for m := range core.Components[l].Designators {
			for i := range files {
				for j := range files[i].Components {
					for k := range files[i].Components[j].Designators {
						if files[i].Components[j].Designators[k].Designator == core.Components[l].Designators[m].Designator {
							files[i].Components[j].Designators[k] = core.Components[l].Designators[m]
							if err := Workspaces.Where("component_id = ?", files[i].Components[j].Id).Updates(&files[i].Components[j]).Error; err != nil {
								return err
							}
							break
						}
					}
				}
			}
		}
	}
	return nil
}