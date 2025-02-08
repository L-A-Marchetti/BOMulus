package core

import (
	"time"
)

/*╔══════════════ FILES MODELS ══════════════╗*/

type XlsmFile struct {
	Path       string      `json:"path"`
	Content    [][]string  `json:"content"`
	Filters    Filter      `json:"filters"`
	Components []Component `json:"components"`
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
	Id                       int             `json:"id"`
	Quantity                 int             `json:"quantity"`
	Mpn                      string          `json:"mpn"`
	Designator               string          `json:"designator"`
	Designators              []Designator    `json:"designators"`
	ImagePath                []MSValue       `json:"image_path"`
	Availability             []MSValue       `json:"availability"`
	DataSheetUrl             []MSValue       `json:"datasheet_url"`
	LifecycleStatus          []MSValue       `json:"lifecycle_status"`
	ROHSStatus               []MSValue       `json:"rohs_status"`
	SuggestedReplacement     []MSValue       `json:"suggested_replacement"`
	PriceBreaks              []MSPriceBreaks `json:"price_breaks"`
	CalculatedPrice          MSPricing       `json:"calculated_price"`
	InfoMessages             []string        `json:"info_messages"`
	Analyzed                 bool            `json:"analyzed"`
	Sources                  []string        `json:"sources"`
	MismatchMpn              bool            `json:"mismatch_mpn"`
	UserDescription          string          `json:"user_description"`
	SupplierDescription      []MSValue       `json:"supplier_description"`
	UserManufacturer         string          `json:"user_manufacturer"`
	SupplierManufacturer     []MSValue       `json:"supplier_manufacturer"`
	Category                 []MSValue       `json:"category"`
	ProductDetailUrl         []MSValue       `json:"product_detail_url"`
	LastRefresh              time.Time       `json:"last_refresh"`
	DetailedParameters       []Parameter     `json:"detailed_parameters"`
	Operator                 string
	OldQuantity, NewQuantity int
}

type Parameter struct {
	Parameter string `json:"parameter"`
	Value     string `json:"value"`
}

type MSPricing struct {
	BestSupplier    string `json:"best_supplier"`
	BestPrice       string `json:"best_price"`
	BestUnitPrice   string `json:"best_unit_price"`
	IsMoqNotReached bool   `json:"is_moq_not_reached"`
	Moq             string `json:"moq"`
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
	Label      Label  `json:"label"`
}

type Label struct {
	Name  string `json:"name"`
	Color string `json:"color"`
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
	MouserErr  string
	DigikeyErr string
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
