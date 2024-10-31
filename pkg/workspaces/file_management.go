/*
* Package: workspaces
* File: file_management.go
*
* Description:
* This file contains functions for managing files within workspaces.
* It includes functionalities to add files to a workspace, update the
* associated .bmls file, and process file data for component extraction.
*
* Main Functions:
* - AddFileToWorkspace: Copies a file to the specified workspace directory
*   and updates the .bmls file with information about the newly added file.
* - UpdateBMLSWithNewFile: Updates the .bmls file with information about
*   a newly added file, including its components and filters.
* - FileProcessing: Processes a specified file to extract its components
*   and filters.
*
* Input:
* - AddFileToWorkspace:
*   - workspacePath (string): The path of the workspace where the file will be added.
*   - filePath (string): The path of the source file to be copied.
*
* - UpdateBMLSWithNewFile:
*   - workspacePath (string): The path of the workspace containing the .bmls file.
*   - fileName (string): The name of the file being added.
*   - filePath (string): The path of the newly added file.
*
* - FileProcessing:
*   - filePath (string): The path of the Excel file to be processed.
*
* Output:
* - AddFileToWorkspace: Returns an error if the operation fails; otherwise, returns nil.
* - UpdateBMLSWithNewFile: Returns an error if updating the .bmls fails; otherwise, returns nil.
* - FileProcessing: Returns a slice of components and filters extracted from the file.
*
* Note:
* Ensure that the specified paths are valid and that necessary permissions
* are granted for file operations. This package assumes that the workspace
* structure is properly initialized before adding files.
 */

package workspaces

import (
	"core"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// AddFileToWorkspace copies a file to the specified workspace directory and updates the .bmls file.
func AddFileToWorkspace(workspacePath string, filePath string) error {
	if workspacePath == "" {
		return fmt.Errorf("no active workspace set")
	}
	fileName := filepath.Base(filePath)
	destPath := filepath.Join(workspacePath, fileName)
	// Open the source file
	srcFile, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("error opening source file: %w", err)
	}
	defer srcFile.Close()
	// Create the destination file
	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("error creating destination file: %w", err)
	}
	defer destFile.Close()
	// Copy the content of the file
	_, err = io.Copy(destFile, srcFile)
	if err != nil {
		return fmt.Errorf("error copying file: %w", err)
	}
	// Update the .bmls file with the new file information
	return UpdateBMLSWithNewFile(workspacePath, fileName, destPath)
}

// updateBMLSWithNewFile updates the .bmls file with information about the newly added file.
func UpdateBMLSWithNewFile(workspacePath, fileName, filePath string) error {
	bmlsFilePath := filepath.Join(workspacePath, fmt.Sprintf("%s.bmls", strings.ReplaceAll(filepath.Base(workspacePath), " ", "_")))
	var workspace Workspace
	// Read the existing .bmls file
	data, err := os.ReadFile(bmlsFilePath)
	if err == nil {
		err = json.Unmarshal(data, &workspace)
		if err != nil {
			return fmt.Errorf("failed to unmarshal .bmls: %w", err)
		}
	}
	components, filters := FileProcessing(filePath) // Assuming this function is defined elsewhere
	// Add information about the new file
	workspace.Files = append(workspace.Files, FileInfo{
		Name:       fileName,
		Path:       filePath,
		Components: components,
		Filters:    filters,
	})
	// Write updated data to the .bmls file
	jsonData, err := json.MarshalIndent(workspace, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated workspace: %w", err)
	}
	return os.WriteFile(bmlsFilePath, jsonData, 0644)
}

func FileProcessing(filePath string) ([]core.Component, core.Filter) {
	file := core.XlsmFile{
		Path: filePath,
	}
	core.XlsmReader(&file)
	core.HeaderDetection(&file)
	core.ComponentsDetection(&file)
	return file.Components, file.Filters
}
