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
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func DeleteWorkspace(path string) error {
	bomulusPath := filepath.Join("./", "config.bmls")
	db, err := gorm.Open(sqlite.Open(bomulusPath), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	var workspace Workspace
	if err := db.Where("path = ?", path).First(&workspace).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("workspace not found")
		}
		return fmt.Errorf("failed to find workspace: %w", err)
	}

	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&workspace).Error; err != nil {
			return fmt.Errorf("failed to delete workspace: %w", err)
		}

		if err := os.RemoveAll(path); err != nil {
			return fmt.Errorf("failed to delete directory %s: %w", path, err)
		}

		return nil
	})
}
