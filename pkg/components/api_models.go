package components

import "time"

// DIGIKEY API MODELS

type Response struct {
	Products                    []Product                 `json:"Products"`
	ProductsCount               int                       `json:"ProductsCount"`
	ExactMatches                []Product                 `json:"ExactMatches"`
	FilterOptions               FilterOptions             `json:"FilterOptions"`
	SearchLocaleUsed            SearchLocaleUsed          `json:"SearchLocaleUsed"`
	AppliedParametricFiltersDto []AppliedParametricFilter `json:"AppliedParametricFiltersDto"`
}

type Product struct {
	Description                Description        `json:"Description"`
	Manufacturer               Manufacturer       `json:"Manufacturer"`
	ManufacturerProductNumber  string             `json:"ManufacturerProductNumber"`
	UnitPrice                  float64            `json:"UnitPrice"`
	ProductUrl                 string             `json:"ProductUrl"`
	DatasheetUrl               string             `json:"DatasheetUrl"`
	PhotoUrl                   string             `json:"PhotoUrl"`
	ProductVariations          []ProductVariation `json:"ProductVariations"`
	QuantityAvailable          int                `json:"QuantityAvailable"`
	ProductStatus              ProductStatus      `json:"ProductStatus"`
	BackOrderNotAllowed        bool               `json:"BackOrderNotAllowed"`
	NormallyStocking           bool               `json:"NormallyStocking"`
	Discontinued               bool               `json:"Discontinued"`
	EndOfLife                  bool               `json:"EndOfLife"`
	Ncnr                       bool               `json:"Ncnr"`
	PrimaryVideoUrl            string             `json:"PrimaryVideoUrl"`
	Parameters                 []Parameter        `json:"Parameters"`
	BaseProductNumber          BaseProductNumber  `json:"BaseProductNumber"`
	Category                   Category           `json:"Category"`
	DateLastBuyChance          time.Time          `json:"DateLastBuyChance"`
	ManufacturerLeadWeeks      string             `json:"ManufacturerLeadWeeks"`
	ManufacturerPublicQuantity int                `json:"ManufacturerPublicQuantity"`
	Series                     Series             `json:"Series"`
	ShippingInfo               string             `json:"ShippingInfo"`
	Classifications            Classifications    `json:"Classifications"`
}

type Description struct {
	ProductDescription  string `json:"ProductDescription"`
	DetailedDescription string `json:"DetailedDescription"`
}

type Manufacturer struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
}

type ProductVariation struct {
	DigiKeyProductNumber            string      `json:"DigiKeyProductNumber"`
	PackageType                     PackageType `json:"PackageType"`
	StandardPricing                 []Pricing   `json:"StandardPricing"`
	MyPricing                       []Pricing   `json:"MyPricing"`
	MarketPlace                     bool        `json:"MarketPlace"`
	TariffActive                    bool        `json:"TariffActive"`
	Supplier                        Supplier    `json:"Supplier"`
	QuantityAvailableforPackageType int         `json:"QuantityAvailableforPackageType"`
	MaxQuantityForDistribution      int         `json:"MaxQuantityForDistribution"`
	MinimumOrderQuantity            int         `json:"MinimumOrderQuantity"`
	StandardPackage                 int         `json:"StandardPackage"`
	DigiReelFee                     float64     `json:"DigiReelFee"`
}

type PackageType struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
}

type Pricing struct {
	BreakQuantity int     `json:"BreakQuantity"`
	UnitPrice     float64 `json:"UnitPrice"`
	TotalPrice    float64 `json:"TotalPrice"`
}

type Supplier struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
}

type ProductStatus struct {
	Id     int    `json:"Id"`
	Status string `json:"Status"`
}

type Parameter struct {
	ParameterId   int    `json:"ParameterId"`
	ParameterText string `json:"ParameterText"`
	ParameterType string `json:"ParameterType"`
	ValueId       string `json:"ValueId"`
	ValueText     string `json:"ValueText"`
}

type BaseProductNumber struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
}

type Category struct {
	CategoryId      int           `json:"CategoryId"`
	ParentId        int           `json:"ParentId"`
	Name            string        `json:"Name"`
	ProductCount    int           `json:"ProductCount"`
	NewProductCount int           `json:"NewProductCount"`
	ImageUrl        string        `json:"ImageUrl"`
	SeoDescription  string        `json:"SeoDescription"`
	ChildCategories []interface{} `json:"ChildCategories"`
}

type Series struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
}

type Classifications struct {
	ReachStatus              string `json:"ReachStatus"`
	RohsStatus               string `json:"RohsStatus"`
	MoistureSensitivityLevel string `json:"MoistureSensitivityLevel"`
	ExportControlClassNumber string `json:"ExportControlClassNumber"`
	HtsusCode                string `json:"HtsusCode"`
}

type FilterOptions struct {
	Manufacturers      []FilterOption     `json:"Manufacturers"`
	Packaging          []FilterOption     `json:"Packaging"`
	Status             []FilterOption     `json:"Status"`
	Series             []FilterOption     `json:"Series"`
	ParametricFilters  []ParametricFilter `json:"ParametricFilters"`
	TopCategories      []TopCategory      `json:"TopCategories"`
	MarketPlaceFilters []string           `json:"MarketPlaceFilters"`
}

type FilterOption struct {
	Id           int    `json:"Id"`
	Value        string `json:"Value"`
	ProductCount int    `json:"ProductCount"`
}

type ParametricFilter struct {
	Category      FilterOption  `json:"Category"`
	ParameterType string        `json:"ParameterType"`
	ParameterId   int           `json:"ParameterId"`
	ParameterName string        `json:"ParameterName"`
	FilterValues  []FilterValue `json:"FilterValues"`
}

type FilterValue struct {
	ProductCount    int    `json:"ProductCount"`
	ValueId         string `json:"ValueId"`
	ValueName       string `json:"ValueName"`
	RangeFilterType string `json:"RangeFilterType"`
}

type TopCategory struct {
	RootCategory FilterOption `json:"RootCategory"`
	Category     FilterOption `json:"Category"`
	Score        float64      `json:"Score"`
	ImageUrl     string       `json:"ImageUrl"`
}

type SearchLocaleUsed struct {
	Site     string `json:"Site"`
	Language string `json:"Language"`
	Currency string `json:"Currency"`
}

type AppliedParametricFilter struct {
	Id       int    `json:"Id"`
	Text     string `json:"Text"`
	Priority int    `json:"Priority"`
}

// MOUSER API MODELS

type SearchByPartRequest struct {
	MouserPartNumber  string `json:"mouserPartNumber"`
	PartSearchOptions string `json:"partSearchOptions"`
}

type RequestPayload struct {
	SearchByPartRequest SearchByPartRequest `json:"SearchByPartRequest"`
}

type Error struct {
	ID                    int    `json:"Id"`
	Code                  string `json:"Code"`
	Message               string `json:"Message"`
	ResourceKey           string `json:"ResourceKey"`
	ResourceFormatString  string `json:"ResourceFormatString"`
	ResourceFormatString2 string `json:"ResourceFormatString2"`
	PropertyName          string `json:"PropertyName"`
}

type ProductAttribute struct {
	AttributeName  string `json:"AttributeName"`
	AttributeValue string `json:"AttributeValue"`
	AttributeCost  string `json:"AttributeCost"`
}

type PriceBreak struct {
	Quantity int    `json:"Quantity"`
	Price    string `json:"Price"`
	Currency string `json:"Currency"`
}

type AlternatePackaging struct {
	APMfrPN string `json:"APMfrPN"`
}

type UnitWeightKg struct {
	UnitWeight float64 `json:"UnitWeight"`
}

type StandardCost struct {
	Standardcost float64 `json:"Standardcost"`
}

type AvailabilityOnOrder struct {
	Quantity int    `json:"Quantity"`
	Date     string `json:"Date"`
}

type ProductCompliance struct {
	ComplianceName  string `json:"ComplianceName"`
	ComplianceValue string `json:"ComplianceValue"`
}

type Part struct {
	Availability           string                `json:"Availability"`
	DataSheetUrl           string                `json:"DataSheetUrl"`
	Description            string                `json:"Description"`
	FactoryStock           string                `json:"FactoryStock"`
	ImagePath              string                `json:"ImagePath"`
	Category               string                `json:"Category"`
	LeadTime               string                `json:"LeadTime"`
	LifecycleStatus        string                `json:"LifecycleStatus"`
	Manufacturer           string                `json:"Manufacturer"`
	ManufacturerPartNumber string                `json:"ManufacturerPartNumber"`
	Min                    string                `json:"Min"`
	Mult                   string                `json:"Mult"`
	MouserPartNumber       string                `json:"MouserPartNumber"`
	ProductAttributes      []ProductAttribute    `json:"ProductAttributes"`
	PriceBreaks            []PriceBreak          `json:"PriceBreaks"`
	AlternatePackagings    []AlternatePackaging  `json:"AlternatePackagings"`
	ProductDetailUrl       string                `json:"ProductDetailUrl"`
	Reeling                bool                  `json:"Reeling"`
	ROHSStatus             string                `json:"ROHSStatus"`
	REACH_SVHC             []string              `json:"REACH-SVHC"`
	SuggestedReplacement   string                `json:"SuggestedReplacement"`
	MultiSimBlue           int                   `json:"MultiSimBlue"`
	UnitWeightKg           UnitWeightKg          `json:"UnitWeightKg"`
	StandardCost           StandardCost          `json:"StandardCost"`
	IsDiscontinued         string                `json:"IsDiscontinued"`
	RTM                    string                `json:"RTM"`
	MouserProductCategory  string                `json:"MouserProductCategory"`
	IPCCode                string                `json:"IPCCode"`
	SField                 string                `json:"SField"`
	VNum                   string                `json:"VNum"`
	ActualMfrName          string                `json:"ActualMfrName"`
	AvailableOnOrder       string                `json:"AvailableOnOrder"`
	AvailabilityInStock    string                `json:"AvailabilityInStock"`
	AvailabilityOnOrder    []AvailabilityOnOrder `json:"AvailabilityOnOrder"`
	InfoMessages           []string              `json:"InfoMessages"`
	SalesMaximumOrderQty   string                `json:"SalesMaximumOrderQty"`
	RestrictionMessage     string                `json:"RestrictionMessage"`
	PID                    string                `json:"PID"`
	ProductCompliance      []ProductCompliance   `json:"ProductCompliance"`
}

type SearchResults struct {
	NumberOfResult int    `json:"NumberOfResult"`
	Parts          []Part `json:"Parts"`
}

type ApiResponse struct {
	Errors        []Error       `json:"Errors"`
	SearchResults SearchResults `json:"SearchResults"`
}
