package components

import (
	"config"
	"core"
	"fmt"
	"regexp"
)

func MPNInterpreter(i int) {
	for _, MPNInterpreter := range config.Interpreter {
		re := regexp.MustCompile(MPNInterpreter.Pattern)
		matches := re.FindStringSubmatch(core.Components[i].Mpn)
		if matches != nil {
			fmt.Println(MPNInterpreter.Brand, " | ", MPNInterpreter.Family)
		}
		for j, match := range matches {
			if j != 0 {
				fmt.Println(MPNInterpreter.Specs[j], ": ", match)
				if MPNInterpreter.Specs[j] == "EIA Size Code" {
					if dimensions, ok := MPNInterpreter.Dimensions[match]; ok {
						fmt.Printf(
							"Dimensions:\nLength: %.3f (%.3f) ±%.3f (%.3f)\n",
							dimensions.Length.Millimeters,
							dimensions.Length.Inches,
							dimensions.Length.MillimetersTolerance,
							dimensions.Length.InchesTolerance,
						)
						fmt.Printf(
							"Width: %.3f (%.3f) ±%.3f (%.3f)\n",
							dimensions.Width.Millimeters,
							dimensions.Width.Inches,
							dimensions.Width.MillimetersTolerance,
							dimensions.Width.InchesTolerance,
						)
						fmt.Printf(
							"Bandwidth: %.3f (%.3f) ±%.3f (%.3f)\n",
							dimensions.Bandwidth.Millimeters,
							dimensions.Bandwidth.Inches,
							dimensions.Bandwidth.MillimetersTolerance,
							dimensions.Bandwidth.InchesTolerance,
						)
						fmt.Printf(
							"Separation Minimum: %.3f (%.3f)\n",
							dimensions.SeparationMinimum.Millimeters,
							dimensions.SeparationMinimum.Inches,
						)
						fmt.Println("Mounting Technique: ", dimensions.MountingTechnique)
						fmt.Println("Notes: ", dimensions.Notes)
					}
				}
			}
		}
	}
}
