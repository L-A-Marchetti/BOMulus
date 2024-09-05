package config

import (
	"strconv"
)

type MPNInterpreter struct {
	Pattern      string
	Manufacturer string
	Family       string
	Specs        map[int]string
	MLCC         MLCC
}

type MLCC struct {
	TerminationStyle     string
	Capacitance          func(string) Capacitance
	VDC                  map[string]float64
	Dielectric           map[string]string
	Tolerance            map[string]Tolerance
	CaseCode             string
	OperatingTemperature OperatingTemperature
	Packaging            map[string]string
}

type Tolerance struct {
	Value float64
	Unity string
}

type Capacitance struct {
	Value float64
	Unity string
}

type OperatingTemperature struct {
	MinimumOperatingTemperature float64
	MaximumOperatingTemperature float64
	TemperatureUnity            string
}

var Interpreter []MPNInterpreter = []MPNInterpreter{KEMET_MLCC}

/*╔══════════════ KEMET ══════════════╗*/

/*╔══════════════ Multilayer Ceramic Chip Capacitors ══════════════╗*/

var (
	KEMET_MLCC MPNInterpreter = MPNInterpreter{
		Pattern:      `^([A-Z])(\d{4})([A-Z])(\d{3})([A-Z])(\d)([A-Z])([A-Z])([A-Z])([A-Z]{2}|\d{4})?$`,
		Manufacturer: "KEMET",
		Family:       "Multilayer Ceramic Capacitors MLCC - SMD/SMT",
		Specs: map[int]string{
			1:  "Ceramic",
			2:  "EIA Size Code",
			3:  "Specification/Series",
			4:  "Capacitance Code (pF)",
			5:  "Capacitance Tolerance",
			6:  "Rated Voltage (VDC)",
			7:  "Dielectric",
			8:  "Failure Rate/Design",
			9:  "Termination Finish",
			10: "Packaging/Grade (C-Spec)",
		},
		MLCC: MLCC{
			TerminationStyle: "100% Matte Sn",
			Capacitance:      DecodeCapacitance,
			VDC: map[string]float64{
				"9":  6.3,
				"8":  10,
				"4:": 16,
				"3":  25,
				"6":  35,
				"5":  50,
				"1":  100,
				"2":  200,
				"A":  250,
			},
			Dielectric: map[string]string{
				"G": "C0G",
				"R": "X7R",
			},
			Tolerance: map[string]Tolerance{
				"B": {0.10, "pF"},
				"C": {0.25, "pF"},
				"D": {0.5, "pF"},
				"F": {1.0, "%"},
				"G": {2.0, "%"},
				"J": {5.0, "%"},
				"K": {10.0, "%"},
				"M": {20.0, "%"},
			},
			OperatingTemperature: OperatingTemperature{
				MinimumOperatingTemperature: -55,
				MaximumOperatingTemperature: 125,
				TemperatureUnity:            "°C",
			},
			Packaging: map[string]string{
				"":     "Bulk Bag/Unmarked",
				"TU":   `7" Reel/Unmarked`,
				"7411": `13" Reel/Unmarked`,
				"7210": `13" Reel/Unmarked`,
				"TM":   `7" Reel/Marked`,
				"7040": `13" Reel/Marked`,
				"7215": `13" Reel/Marked`,
				"7081": `7" Reel/Unmarked/2 mm pitch`,
				"7082": `13" Reel/Unmarked/2 mm pitch`,
			},
		},
	}
)

func DecodeCapacitance(s string) Capacitance {
	value := 0.0
	num, _ := strconv.Atoi(s[:2])
	exp, _ := strconv.Atoi(s[2:])
	value = float64(num)
	if exp == 1 {
		return Capacitance{value * 10, "pF"}
	} else if exp == 2 {
		return Capacitance{value * 100, "pF"}
	} else if exp == 3 {
		return Capacitance{value * 1000, "pF"}
	} else if exp == 8 {
		return Capacitance{value / 100, "pF"}
	} else if exp == 9 {
		return Capacitance{value / 10, "pF"}
	} else {
		return Capacitance{value, "pF"}
	}
}

/*╚════════════════════════════════════════════════════════════════╝*/

/*╚═══════════════════════════════════╝*/
