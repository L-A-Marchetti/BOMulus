package config

import "github.com/gotk3/gotk3/gtk"

const (
	TITLE                    string = "BOMulus"
	WIN_WIDTH                int    = 800
	WIN_HEIGHT               int    = 800
	INIT_FILE_PATH_1         string = "path/to/file1"
	INIT_FILE_PATH_2         string = "path/to/file2"
	FILE_PREFIX              string = "file://"
	INIT_BOX_MSG             string = "Drag and drop a file here"
	ONE_FILE_MSG             string = "You need at least 2 files to compare..."
	OUTPUT_FONT              string = "monospace 9"
	WRAP_WIDTH               int    = 400
	CELLS_MIN_WIDTH          int    = 20
	FILE_EXT                 string = ".xlsm"
	INIT_BUTTON_LABEL        string = "Compare"
	WRONG_EXT_MSG            string = "Please insert an .xlsm file"
	EQUAL_BG_COLOR           string = ""
	INSERT_BG_COLOR          string = "#49c973"
	DELETE_BG_COLOR          string = "#ff5c8a"
	OLD_UPDATE_BG_COLOR      string = "#c89dfc"
	NEW_UPDATE_BG_COLOR      string = "#b67cfc"
	OLD_UPDATE_DIFF_BG_COLOR string = "#ee9dfc"
	NEW_UPDATE_DIFF_BG_COLOR string = "#68c8d9"
	BOXES_CSS                string = `
	#box {
		border: 1px dotted black;
		border-radius: 5px;
		padding: 30px;
		margin: 30px;
	}
	`
	BOXES_CLASS_NAME string = "box"
	SCROLLBAR_POLICY        = gtk.POLICY_ALWAYS // Replace by gtk.POLICY_AUTOMATIC if needed.
	SCROLLBAR_CSS    string = `
	scrollbar slider {
	    min-width: 15px;
	    min-height: 15px;
	}
	spinbutton button {
    min-width: 15px;
    min-height: 15px;
    padding: 1px;
	}
	spinbutton entry {
    min-width: 9px;
    min-height: 15px;
	}
	`
	SUMMARY_SPACING string = "              "
	LOGO_PATH       string = "assets/logo.png"
)

var (
	HEADER_KEYWORDS = []string{
		"Designator",
		"Part Number",
		"Description",
		"Quantity",
		"Manufacturer",
		"Manufacturer Part Number",
		"Value",
		"Footprint",
		"Supplier",
		"Supplier Part Number",
		"Package",
		"Tolerance",
		"Voltage Rating",
		"Power Rating",
		"Temperature Coefficient",
		"Lifecycle Status",
		"RoHS Status",
		"Lead Time",
		"Cost",
		"Min Order Quantity",
	}
)
