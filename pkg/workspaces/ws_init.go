package workspaces

import (
	"core"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	BOMulusConfig *gorm.DB
	Workspaces *gorm.DB
)

func InitBomulus() error {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}
	appDir := filepath.Join(userConfigDir, "BOMulus")
	err = os.MkdirAll(appDir, os.ModePerm)
	if err != nil {
		return err
	}
	configPath := filepath.Join(appDir, "config.db")
	workspacesPath := filepath.Join(appDir, "workspaces.db")
	
	bomulusConfig, err := gorm.Open(sqlite.Open(configPath), &gorm.Config{})
	if err != nil {
		return err
	}
	if err := bomulusConfig.AutoMigrate(&BOMulusFile{}); err != nil {
		return err
	}
	BOMulusConfig = bomulusConfig

	workspaces, err := gorm.Open(sqlite.Open(workspacesPath), &gorm.Config{})
	if err != nil {
		return err
	}
	if err := workspaces.AutoMigrate(&Workspace{}, &FileInfo{}, &core.Filter{}, &core.Component{}, &core.Designator{}, &core.MSImg{}, &core.MSAvailability{}, &core.MSDataSheet{}, &core.MSLifeCycle{}, &core.MSCompliance{}, &core.MSReplacement{}, &core.MSDescription{}, &core.MSManufacturer{}, &core.MSCategory{}, &core.MSDetail{}, &core.MSPriceBreaks{}, &core.PriceBreak{}, &core.MSPricing{}, &core.Parameter{}); err != nil {
		return err
	}
	Workspaces = workspaces

	return nil
}
