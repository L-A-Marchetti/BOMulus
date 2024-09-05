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
			fmt.Println(MPNInterpreter.Manufacturer, " | ", MPNInterpreter.Family)
		}
		for j, match := range matches {
			if j != 0 {
				if MPNInterpreter.Specs[j] == "Capacitance" {
					Capacitance := MPNInterpreter.MLCC.Capacitance(match)
					fmt.Println("Capacitance: ", Capacitance.Value, Capacitance.Unity)
				} else if MPNInterpreter.Specs[j] == "Rated Voltage (VDC)" {
					if VDC, ok := MPNInterpreter.MLCC.VDC[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", VDC, "V")
					}
				} else if MPNInterpreter.Specs[j] == "Dielectric" {
					fmt.Println(MPNInterpreter.Specs[j], ": ", MPNInterpreter.MLCC.Dielectric(match))
				} else if MPNInterpreter.Specs[j] == "Capacitance Tolerance" {
					if tolerance, ok := MPNInterpreter.MLCC.Tolerance[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", "±", tolerance.Value, tolerance.Unity)
					}
				} else if MPNInterpreter.Specs[j] == "Dimensions" {
					fmt.Println("EIA Size Code", ": ", MPNInterpreter.MLCC.CaseCode(match))
				} else if MPNInterpreter.Specs[j] == "Packaging" {
					if packaging, ok := MPNInterpreter.MLCC.Packaging[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", packaging)
					}
				}
			}
		}
		fmt.Println()
	}
}
