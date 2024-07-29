package core

import (
	"fmt"
	"reflect"
)

// DiffOp represents a single difference operation (Insert, Delete, Equal)
type DiffOp struct {
	Op   string // Operation type: "INSERT", "DELETE", "EQUAL"
	OldX int    // Old matrix x coordinate
	OldY int    // Old matrix y coordinate
	NewX int    // New matrix x coordinate
	NewY int    // New matrix y coordinate
}

// MyersDiff computes the differences between two 2D slices of strings using Myers' algorithm
func MyersDiff() []DiffOp {
	var ops []DiffOp
	i := 0
	j := 0
	for i < len(XlsmFiles[1].Content) && j < len(XlsmFiles[0].Content) {
		if !reflect.DeepEqual(XlsmFiles[1].Content[i], XlsmFiles[0].Content[j]) {
			if InsertFound(i, j) {
				fmt.Println("INSERT")
				fmt.Println(i, XlsmFiles[1].Content[i])
				fmt.Println(j, XlsmFiles[0].Content[j])
				j--
			} else if DeleteFound(i, j) {
				fmt.Println("DELETE")
				fmt.Println(i, XlsmFiles[1].Content[i])
				fmt.Println(j, XlsmFiles[0].Content[j])
				i--
			} else {
				fmt.Println("UPDATE")
				fmt.Println(i, XlsmFiles[1].Content[i])
				fmt.Println(j, XlsmFiles[0].Content[j])
			}
		}
		i++
		j++
	}
	return ops
}

func InsertFound(i, j int) bool {
	for k := i; k < len(XlsmFiles[1].Content); k++ {
		if reflect.DeepEqual(XlsmFiles[1].Content[k], XlsmFiles[0].Content[j]) {
			return true
		}
	}
	return false
}

func DeleteFound(i, j int) bool {
	for k := j; k < len(XlsmFiles[0].Content); k++ {
		if reflect.DeepEqual(XlsmFiles[1].Content[i], XlsmFiles[0].Content[k]) {
			return true
		}
	}
	return false
}
