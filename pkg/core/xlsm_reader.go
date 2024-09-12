package core

import (
	"config"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/xuri/excelize/v2"
)

func XlsmReader() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmReader()", true).Stop()
	}
	ResetContent()
	// Define the path of the os tmp dir.
	tempDir := os.TempDir()
	var tempFiles []string
	defer func() {
		// Clean up temporary files
		for _, file := range tempFiles {
			os.Remove(file)
		}
	}()
	for i := range XlsmFiles {
		filePath, err := url.PathUnescape(strings.TrimSpace(strings.TrimPrefix(XlsmFiles[i].Path, config.FILE_PREFIX)))
		ErrorsHandler(err)
		if runtime.GOOS == "windows" {
			filePath = strings.TrimPrefix(filePath, "/")
		}
		// Create a temporary copy of the file
		tempFile := filepath.Join(tempDir, fmt.Sprintf("temp_%d.xlsm", i))
		err = CopyFile(filePath, tempFile)
		ErrorsHandler(err)
		tempFiles = append(tempFiles, tempFile)
		// Open the temporary file
		f, err := excelize.OpenFile(tempFile)
		ErrorsHandler(err)
		defer f.Close()
		// Read every used row
		rows, err := f.GetRows(f.GetSheetName(0))
		ErrorsHandler(err)
		// Convert data into a string matrix
		XlsmFiles[i].Content = append(XlsmFiles[i].Content, rows...)
	}
	blankTailsFix()
}
