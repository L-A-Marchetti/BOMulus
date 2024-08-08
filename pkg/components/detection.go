package components

import (
	"core"
	"fmt"
	"math"
	"strconv"
)

func ComponentsDetection() {
	colSafety := math.Max(float64(core.Filters.Quantity), float64(core.Filters.Mpn))
	for i := core.Filters.Header + 1; i < len(core.XlsmFiles[1].Content); i++ {
		if int(colSafety) < len(core.XlsmFiles[1].Content[i]) {
			quantity, err := strconv.Atoi(core.XlsmFiles[1].Content[i][core.Filters.Quantity])
			if err != nil {
				return
			}
			component := core.Component{
				Quantity: quantity,
				Mpn:      core.XlsmFiles[1].Content[i][core.Filters.Mpn]}
			core.Components = append(core.Components, component)
		}
	}
	fmt.Println(core.Components)
}
