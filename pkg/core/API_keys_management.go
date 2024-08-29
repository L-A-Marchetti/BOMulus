package core

import (
	"config"
	"os"
)

func SaveAPIKey() {
	if config.DEBUGGING {
		defer StartBenchmark("core.SaveAPIKey()", false).Stop()
	}
	err := os.WriteFile(config.API_KEY_FILE, []byte(config.USER_API_KEY), 0644)
	ErrorsHandler(err)
}

func LoadAPIKey() (bool, string) {
	if config.DEBUGGING {
		defer StartBenchmark("core.LoadAPIKey()", false).Stop()
	}
	APIKey, err := os.ReadFile(config.API_KEY_FILE)
	if err != nil {
		ErrorsHandler(err)
		return false, ""
	}
	return true, string(APIKey)
}
