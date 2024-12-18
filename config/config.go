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
	API_URL         string = "https://api.mouser.com/api/v1/search/partnumber"
	DIGIKEY_API_URL string = "https://api.digikey.com/products/v4/search/keyword"
	DK_ENDPOINT     string = "https://api.digikey.com/v1/oauth2/token"
)

var (
	//USER_API_KEY          string = ""
	//DIGIKEY_API_KEY       string = ""
	ANALYZE_SAVE_STATE    bool
	ANALYSIS_REFRESH_DAYS int
	API_PRIORITY          []string = nil
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
