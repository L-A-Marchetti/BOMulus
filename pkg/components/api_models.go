package components

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
