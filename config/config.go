package config

/*╔══════════════ APPLICATION SETTINGS ══════════════╗*/

const (
	TITLE      string = "BOMulus"
	WIN_WIDTH  int    = 1000
	WIN_HEIGHT int    = 475
	DEBUGGING  bool   = false
)

/*╚══════════════════════════════════════════════════╝*/

/*╔══════════════ FILE SETTINGS ══════════════╗*/

var FILE_EXT = []string{".xlsm", ".xlsx"}

/*╚═══════════════════════════════════════════╝*/

/*╔══════════════ API SETTINGS ══════════════╗*/

const (
	API_URL string = "https://api.mouser.com/api/v1/search/partnumber"
)

var (
	USER_API_KEY          string = ""
	ANALYZE_SAVE_STATE    bool
	ANALYSIS_REFRESH_DAYS int
)

/*╚═══════════════════════════════════════════════╝*/

/*╔══════════════ BOM HEADER KEYWORDS ══════════════╗*/

var (
	HEADER_KEYWORDS = []string{
		"Designator",
		"Part Number",
		"Description",
		"Quantity",
		"Manufacturer",
		"Manufacturer Name",
		"Manufacturer Part Number",
		"Mpn",
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

/*╚══════════════════════════════════════════════════╝*/
