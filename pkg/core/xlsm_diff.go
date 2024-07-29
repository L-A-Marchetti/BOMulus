package core

import (
	"reflect"
)

// Diff algo with an UPDATE function added.
func XlsmDiff() {
	var delta XlsmDelta
	i := 0
	j := 0
	for i < len(XlsmFiles[1].Content) && j < len(XlsmFiles[0].Content) {
		if !reflect.DeepEqual(XlsmFiles[1].Content[i], XlsmFiles[0].Content[j]) {
			if InsertFound(i, j) {
				delta = XlsmDelta{"INSERT", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
				//fmt.Println("INSERT")
				//fmt.Println(i, XlsmFiles[1].Content[i])
				j--
			} else if DeleteFound(i, j) {
				delta = XlsmDelta{"DELETE", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
				//fmt.Println("DELETE")
				//fmt.Println(j, XlsmFiles[0].Content[j])
				i--
			} else {
				delta = XlsmDelta{"UPDATE", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
				//fmt.Println("UPDATE")
				//fmt.Println(j, XlsmFiles[0].Content[j])
				//fmt.Println(i, XlsmFiles[1].Content[i])
			}
		} else {
			delta = XlsmDelta{"EQUAL", j, i}
			XlsmDeltas = append(XlsmDeltas, delta)
			//fmt.Println("EQUAL")
			//fmt.Println(j, i, XlsmFiles[1].Content[i])
		}
		i++
		j++
	}
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
