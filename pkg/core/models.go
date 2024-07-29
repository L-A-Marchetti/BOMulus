package core

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
	{Path: "path/to/file1"},
	{Path: "path/to/file2"},
}

var XlsmDeltas []XlsmDelta
