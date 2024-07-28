package gui

import (
	"core"
	"fmt"
)

func BtnCompare() {
	//fmt.Println(core.XlsmFiles)
	core.XlsmReader()
	fmt.Println(core.XlsmFiles[0].Content[12][0])
	diff := core.MyersDiff()
	for _, op := range diff {
		if op.Op == "INSERT" {
			//fmt.Printf("Inserted at row %d, column %d\n", op.NewX, op.NewY)
		}
	}
}
