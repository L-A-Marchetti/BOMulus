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
	Equal  bool
	Delete bool
	Insert bool
	Update bool
	Swap   bool
}

var XlsmFiles = []XlsmFile{
	{Path: config.INIT_FILE_PATH_1},
	{Path: config.INIT_FILE_PATH_2},
}

var XlsmDeltas []XlsmDelta

var Filters = Filter{true, true, true, true, false}

func ResetContent() {
	XlsmFiles[0].Content = nil
	XlsmFiles[1].Content = nil
}

func ResetDeltas() {
	XlsmDeltas = nil
}
