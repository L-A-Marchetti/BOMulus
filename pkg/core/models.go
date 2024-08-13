package core

import "config"

type XlsmFile struct {
	Path    string
	Content [][]string
}

type XlsmDelta struct {
	Operator string
	OldRow   int
	NewRow   int
}

type Filter struct {
	Equal    bool
	Delete   bool
	Insert   bool
	Update   bool
	Swap     bool
	Header   int
	Quantity int
	Mpn      int
}

// As a starting point.
type Component struct {
	OldRow, NewRow       int
	Quantity             int
	Mpn                  string
	ImagePath            string
	Availability         string
	DataSheetUrl         string
	LifecycleStatus      string
	ROHSStatus           string
	SuggestedReplacement string
	PriceBreaks          []PriceBreak
	Analyzed             bool
}

type PriceBreak struct {
	Quantity int    `json:"Quantity"`
	Price    string `json:"Price"`
	Currency string `json:"Currency"`
}

var XlsmFiles = []XlsmFile{
	{Path: config.INIT_FILE_PATH_1},
	{Path: config.INIT_FILE_PATH_2},
}

var XlsmDeltas []XlsmDelta

var Filters = Filter{true, true, true, true, false, 0, 0, 0}

var Components = []Component{}

func ResetContent() {
	XlsmFiles[0].Content = nil
	XlsmFiles[1].Content = nil
}

func ResetDeltas() {
	XlsmDeltas = nil
}

func ResetComponents() {
	Components = []Component{}
}
