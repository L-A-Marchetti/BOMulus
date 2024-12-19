package core

import (
	"time"
)

/*╔══════════════ FILES MODELS ══════════════╗*/

type XlsmFile struct {
	Path       string
	Content    [][]string
	Filters    Filter
	Components []Component
}

/*╚══════════════════════════════════════════╝*/

/*╔══════════════ FILTER MODEL ══════════════╗*/

type Filter struct {
	Header       int `json:"header"`
	Quantity     int `json:"quantity"`
	Mpn          int `json:"mpn"`
	Description  int `json:"description"`
	Designator   int `json:"designator"`
	Manufacturer int `json:"manufacturer"`
}

/*╚══════════════════════════════════════════╝*/

/*╔══════════════ COMPONENT MODELS ══════════════╗*/

type Component struct {
	Id                       int          `json:"id"`
	Quantity                 int          `json:"quantity"`
	Mpn                      string       `json:"mpn"`
	Designator               string       `json:"designator"`
	Designators              []Designator `json:"designators"`
	ImagePath                []MSValue    `json:"image_path"`
	Availability             []MSValue    `json:"availability"`
	DataSheetUrl             []MSValue    `json:"datasheet_url"`
	LifecycleStatus          []MSValue    `json:"lifecycle_status"`
	ROHSStatus               []MSValue    `json:"rohs_status"`
	SuggestedReplacement     []MSValue    `json:"suggested_replacement"`
	PriceBreaks              []PriceBreak `json:"price_breaks"`
	InfoMessages             []string     `json:"info_messages"`
	Analyzed                 bool         `json:"analyzed"`
	MismatchMpn              []Component  `json:"mismatch_mpn"`
	UserDescription          string       `json:"user_description"`
	SupplierDescription      []MSValue    `json:"supplier_description"`
	UserManufacturer         string       `json:"user_manufacturer"`
	SupplierManufacturer     []MSValue    `json:"supplier_manufacturer"`
	Category                 []MSValue    `json:"category"`
	ProductDetailUrl         []MSValue    `json:"product_detail_url"`
	LastRefresh              time.Time    `json:"last_refresh"`
	Operator                 string
	OldQuantity, NewQuantity int
}

type MSPriceBreaks struct {
	Supplier string       `json:"supplier"`
	Value    []PriceBreak `json:"value"`
}

type MSValue struct {
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type Designator struct {
	Designator string `json:"designator"`
	Label      string `json:"label"`
}

type PriceBreak struct {
	Quantity int    `json:"Quantity"`
	Price    string `json:"Price"`
	Currency string `json:"Currency"`
}

var (
	Components = []Component{} // Do we still need it ?
)

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ RESET FUNCTIONS ══════════════╗*/

func ResetComponents() {
	Components = []Component{}
}

func ResetAnalysisStatus() {
	AnalysisState = AnalysisStatus{}
}

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ ANALYSIS STATUS MODEL ══════════════╗*/

type AnalysisStatus struct {
	InProgress bool
	Completed  bool
	Progress   float64
	Total      int
	Current    int
	KeyIsValid bool
	IdxStart   int
	IdxEnd     int
}

var AnalysisState AnalysisStatus

/*╚═══════════════════════════════════════════════════╝*/

/*╔══════════════ BENCHMARK MODEL ══════════════╗*/

type BenchmarkTimer struct {
	startTime time.Time
	name      string
	isVital   bool
}

/*╚═════════════════════════════════════════════╝*/
