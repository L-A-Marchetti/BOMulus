package config

const (
	TITLE               string = "BOMulus"
	WIN_WIDTH           int    = 800
	WIN_HEIGHT          int    = 800
	INIT_FILE_PATH_1    string = "path/to/file1"
	INIT_FILE_PATH_2    string = "path/to/file2"
	FILE_PREFIX         string = "file://"
	INIT_BOX_MSG        string = "Drag and drop a file here"
	ONE_FILE_MSG        string = "You need at least 2 files to compare..."
	OUTPUT_FONT         string = "monospace 9"
	WRAP_WIDTH          int    = 400
	CELLS_MIN_WIDTH     int    = 20
	FILE_EXT            string = ".xlsm"
	INIT_BUTTON_LABEL   string = "Compare"
	WRONG_EXT_MSG       string = "Please insert an .xlsm file"
	EQUAL_BG_COLOR      string = ""
	INSERT_BG_COLOR     string = "#3cb257"
	DELETE_BG_COLOR     string = "#b81717"
	OLD_UPDATE_BG_COLOR string = "#a9a528"
	NEW_UPDATE_BG_COLOR string = "#c2c045"
	BOXES_CSS           string = `
	#box {
		border: 1px dotted black;
		border-radius: 5px;
		padding: 30px;
		margin: 30px;
	}
	`
	BOXES_CLASS_NAME string = "box"
)
