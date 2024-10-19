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

type XlsmDelta struct {
	Operator string
	OldRow   int
	NewRow   int
}

/*
	var XlsmFiles = []XlsmFile{
		{Path: config.INIT_FILE_PATH_1},
		{Path: config.INIT_FILE_PATH_2},
	}
*/
var XlsmDeltas []XlsmDelta

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

//var Filters = []Filter{{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}}

/*╚══════════════════════════════════════════╝*/

/*╔══════════════ COMPONENT MODELS ══════════════╗*/

type Component struct {
	Id                   int          `json:"id"`
	Quantity             int          `json:"quantity"`
	Mpn                  string       `json:"mpn"`
	Designator           string       `json:"designator"`
	ImagePath            string       `json:"image_path"`
	Availability         string       `json:"availability"`
	DataSheetUrl         string       `json:"datasheet_url"`
	LifecycleStatus      string       `json:"lifecycle_status"`
	ROHSStatus           string       `json:"rohs_status"`
	SuggestedReplacement string       `json:"suggested_replacement"`
	PriceBreaks          []PriceBreak `json:"price_breaks"`
	InfoMessages         []string     `json:"info_messages"`
	Analyzed             bool         `json:"analyzed"`
	MismatchMpn          []Component  `json:"mismatch_mpn"`
	UserDescription      string       `json:"user_description"`
	SupplierDescription  string       `json:"supplier_description"`
	UserManufacturer     string       `json:"user_manufacturer"`
	SupplierManufacturer string       `json:"supplier_manufacturer"`
	Category             string       `json:"category"`
	ProductDetailUrl     string       `json:"product_detail_url"`
}

type PriceBreak struct {
	Quantity int    `json:"Quantity"`
	Price    string `json:"Price"`
	Currency string `json:"Currency"`
}

var (
	Components    = []Component{} // Do we still need it ?
	OldComponents = []Component{}
	NewComponents = []Component{}
)

/*╚══════════════════════════════════════════════╝*/

/*╔══════════════ RESET FUNCTIONS ══════════════╗*/
/*
func ResetContent() {
	XlsmFiles[0].Content = nil
	XlsmFiles[1].Content = nil
}
*/
func ResetDeltas() {
	XlsmDeltas = nil
}

func ResetComponents() {
	Components = []Component{}
	OldComponents = []Component{}
	NewComponents = []Component{}
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

/*╔══════════════ REPORT GRID MODEL ══════════════╗*/

type ReportGrid struct {
	ExpanderName       string
	Headers            []string
	RowsAttributes     []ComponentMethod
	AttachmentsIter    ComponentMethodIter
	AttachmentsIterMsg ComponentMethodIterMsg
	Attachments        []Attachment
	Jump               int
	Components         []Component
	ButtonIdx          []int
	Msg                bool
}

type Attachment struct {
	Attribute    ComponentMethod
	AttributeMsg ComponentMethodMsg
	Column       int
}

type ComponentMethod func(c *Component) string
type ComponentMethodMsg func(s string) string
type ComponentMethodIter func(c *Component) []Component
type ComponentMethodIterMsg func(c *Component) []string

/*╚════════════════════════════════════════════════╝*/

/*╔══════════════ BENCHMARK MODEL ══════════════╗*/

type BenchmarkTimer struct {
	startTime time.Time
	name      string
	isVital   bool
}

/*╚═════════════════════════════════════════════╝*/
