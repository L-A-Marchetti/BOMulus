package workspaces

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func WsInit() error {
	db, err := gorm.Open(sqlite.Open("config.bmls"), &gorm.Config{})
	if err != nil {
		return err
	}
	err = db.AutoMigrate(&BOMulusFile{}, &Workspace{})
	if err != nil {
		return err
	}
	return nil
}

func BMLSInit(path string, workspace Workspace) error {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		return err
	}
	err = db.AutoMigrate(&Workspace{}, &FileInfo{})
	if err != nil {
		return err
	}
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&workspace).Error; err != nil {
			return fmt.Errorf("error creating workspace: %w", err)
		}
		return nil
	})
}
