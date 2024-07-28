package core

type XlsmFile struct {
	Path    string
	Content [][]string
}

var XlsmFiles = []XlsmFile{
	{Path: "path/to/file1"},
	{Path: "path/to/file2"},
}
