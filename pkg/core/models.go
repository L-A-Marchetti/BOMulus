package core

import (
	"config"
	"time"

	"github.com/gotk3/gotk3/gdk"
)

/*╔══════════════ FILES MODELS ══════════════╗*/

type XlsmFile struct {
	Path    string
	Content [][]string
}

type XlsmDelta struct {
	Operator string
	OldRow   int
	NewRow   int
}

var XlsmFiles = []XlsmFile{
	{Path: config.INIT_FILE_PATH_1},
	{Path: config.INIT_FILE_PATH_2},
}

var XlsmDeltas []XlsmDelta

/*╚══════════════════════════════════════════╝*/

/*╔══════════════ FILTER MODEL ══════════════╗*/

type Filter struct {
	Equal                                             bool
	Delete                                            bool
	Insert                                            bool
	Update                                            bool
	Swap                                              bool
	Header                                            int
	Quantity                                          int
	Mpn                                               int
	Description                                       int
	Designator                                        int
	Manufacturer                                      int
	InsertCount, UpdateCount, DeleteCount, EqualCount int
	OldQuantity, NewQuantity                          int
}

var Filters = Filter{true, true, true, true, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}

/*╚══════════════════════════════════════════╝*/

/*╔══════════════ COMPONENT MODELS ══════════════╗*/

type Component struct {
	Operator                           string
	OldRow, NewRow                     int
	Quantity, OldQuantity, NewQuantity int
	Mpn                                string
	Designator                         string
	ImagePath                          string
	Availability                       string
	DataSheetUrl                       string
	LifecycleStatus                    string
	ROHSStatus                         string
	SuggestedReplacement               string
	PriceBreaks                        []PriceBreak
	InfoMessages                       []string
	Analyzed                           bool
	MismatchMpn                        []Component
	UserDescription                    string
	SupplierDescription                string
	Img                                *gdk.Pixbuf
	UserManufacturer                   string
	SupplierManufacturer               string
	Category                           string
	ProductDetailUrl                   string
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

func ResetContent() {
	XlsmFiles[0].Content = nil
	XlsmFiles[1].Content = nil
}

func ResetDeltas() {
	XlsmDeltas = nil
}

func ResetComponents() {
	Components = []Component{}
	OldComponents = []Component{}
	NewComponents = []Component{}
}

func ResetFilters() {
	Filters = Filter{true, true, true, true, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
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
