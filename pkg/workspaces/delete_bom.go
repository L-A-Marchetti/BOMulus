package workspaces

import "fmt"

func DeleteBOMFile(workspacePath, filePath string) error {
	fmt.Println(workspacePath, filePath)
	return nil
}
