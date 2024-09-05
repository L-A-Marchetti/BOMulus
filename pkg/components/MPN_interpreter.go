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
				if MPNInterpreter.Specs[j] == "Capacitance Code (pF)" {
					Capacitance := MPNInterpreter.MLCC.Capacitance(match)
					fmt.Println("Capacitance: ", Capacitance.Value, Capacitance.Unity)
				} else if MPNInterpreter.Specs[j] == "Rated Voltage (VDC)" {
					if VDC, ok := MPNInterpreter.MLCC.VDC[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", VDC, " VDC")
					}
				} else if MPNInterpreter.Specs[j] == "Dielectric" {
					if Dielectric, ok := MPNInterpreter.MLCC.Dielectric[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", Dielectric)
					}
				} else if MPNInterpreter.Specs[j] == "Capacitance Tolerance" {
					if tolerance, ok := MPNInterpreter.MLCC.Tolerance[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", "±", tolerance.Value, tolerance.Unity)
					}
					fmt.Println("Operating Temperature Range: ", MPNInterpreter.MLCC.OperatingTemperature.MinimumOperatingTemperature, " to ", MPNInterpreter.MLCC.OperatingTemperature.MaximumOperatingTemperature, " (", MPNInterpreter.MLCC.OperatingTemperature.TemperatureUnity, ")")
				} else if MPNInterpreter.Specs[j] == "EIA Size Code" {
					fmt.Println(MPNInterpreter.Specs[j], ": ", match)
				} else if MPNInterpreter.Specs[j] == "Termination Finish" {
					fmt.Println("Termination Style: ", MPNInterpreter.MLCC.TerminationStyle)
				} else if MPNInterpreter.Specs[j] == "Packaging/Grade (C-Spec)" {
					if packaging, ok := MPNInterpreter.MLCC.Packaging[match]; ok {
						fmt.Println(MPNInterpreter.Specs[j], ": ", packaging)
					}
				}
			}
		}
		fmt.Println()
	}
}
