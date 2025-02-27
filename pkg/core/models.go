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
	ID uint `gorm:"primaryKey"`
	FileInfoID 				 uint
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
	Id                       int             `json:"id" gorm:"primaryKey"`
	FileInfoID 				 uint
	Quantity                 int             `json:"quantity"`
	Mpn                      string          `json:"mpn"`
	Designator               string          `json:"designator" gorm:"-"`
	Designators              []Designator    `json:"designators" gorm:"foreignKey:ComponentID"`
	ImagePath                []MSImg       `json:"image_path" gorm:"foreignKey:ComponentID"`
	Availability             []MSAvailability       `json:"availability" gorm:"foreignKey:ComponentID"`
	DataSheetUrl             []MSDataSheet       `json:"datasheet_url" gorm:"foreignKey:ComponentID"`
	LifecycleStatus          []MSLifeCycle       `json:"lifecycle_status" gorm:"foreignKey:ComponentID"`
	ROHSStatus               []MSCompliance       `json:"rohs_status" gorm:"foreignKey:ComponentID"`
	SuggestedReplacement     []MSReplacement       `json:"suggested_replacement" gorm:"foreignKey:ComponentID"`
	PriceBreaks              []MSPriceBreaks `json:"price_breaks" gorm:"foreignKey:ComponentID"`
	CalculatedPrice          MSPricing       `json:"calculated_price" gorm:"foreignKey:ComponentID"`
	InfoMessages             []string        `json:"info_messages" gorm:"json"`
	Analyzed                 bool            `json:"analyzed"`
	Sources                  []string        `json:"sources" gorm:"json"`
	MismatchMpn              bool            `json:"mismatch_mpn"`
	UserDescription          string          `json:"user_description"`
	SupplierDescription      []MSDescription       `json:"supplier_description" gorm:"foreignKey:ComponentID"`
	UserManufacturer         string          `json:"user_manufacturer"`
	SupplierManufacturer     []MSManufacturer       `json:"supplier_manufacturer" gorm:"foreignKey:ComponentID"`
	Category                 []MSCategory       `json:"category" gorm:"foreignKey:ComponentID"`
	ProductDetailUrl         []MSDetail       `json:"product_detail_url" gorm:"foreignKey:ComponentID"`
	LastRefresh              time.Time       `json:"last_refresh"`
	DetailedParameters       []Parameter     `json:"detailed_parameters" gorm:"foreignKey:ComponentID"`
	Operator                 string
	OldQuantity, NewQuantity int
}

type Parameter struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Parameter string `json:"parameter"`
	Value     string `json:"value"`
}

type MSPricing struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	BestSupplier    string `json:"best_supplier"`
	BestPrice       string `json:"best_price"`
	BestUnitPrice   string `json:"best_unit_price"`
	IsMoqNotReached bool   `json:"is_moq_not_reached"`
	Moq             string `json:"moq"`
}

type MSPriceBreaks struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string       `json:"supplier"`
	Value    []PriceBreak `json:"value" gorm:"foreignKey:MSPriceBreaksID"`
}
/*
type MSValue struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}
*/


type MSImg struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSAvailability struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSDataSheet struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSLifeCycle struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSCompliance struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSReplacement struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSDescription struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSManufacturer struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSCategory struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type MSDetail struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Supplier string `json:"supplier"`
	Value    string `json:"value"`
}

type Designator struct {
	ID 			uint  `gorm:"primaryKey"`
	ComponentID uint
	Designator string `json:"designator"`
	Label      Label  `json:"label" gorm:"embedded"`
}

type Label struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

type PriceBreak struct {
	ID 			uint  `gorm:"primaryKey"`
	MSPriceBreaksID uint
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
