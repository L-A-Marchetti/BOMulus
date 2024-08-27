package core

import (
	"config"
	"reflect"
)

// Diff algo with an UPDATE function added.
func XlsmDiff() {
	if config.DEBUGGING {
		defer StartBenchmark("XlsmDiff()", false).Stop()
	}
	ResetDeltas()
	var delta XlsmDelta
	i := Filters.Header
	j := Filters.Header
	for i < len(XlsmFiles[1].Content) && j < len(XlsmFiles[0].Content) {
		if !reflect.DeepEqual(XlsmFiles[1].Content[i], XlsmFiles[0].Content[j]) {
			if InsertFound(i, j) {
				delta = XlsmDelta{"INSERT", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
				j--
			} else if DeleteFound(i, j) {
				delta = XlsmDelta{"DELETE", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
				i--
			} else {
				delta = XlsmDelta{"UPDATE", j, i}
				XlsmDeltas = append(XlsmDeltas, delta)
			}
		} else {
			delta = XlsmDelta{"EQUAL", j, i}
			XlsmDeltas = append(XlsmDeltas, delta)
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
