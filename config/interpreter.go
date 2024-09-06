package config

import "strconv"

type MPNInterpreter struct {
	Pattern      string
	Manufacturer string
	Family       string
	Specs        map[int]string
	MLCC         MLCC
}

type MLCC struct {
	Capacitance func(string) Capacitance
	VDC         map[string]float64
	Dielectric  func(string) string
	Tolerance   map[string]Tolerance
	CaseCode    func(string) string
	Packaging   map[string]string
}

type Tolerance struct {
	Value float64
	Unity string
}

type Capacitance struct {
	Value float64
	Unity string
}

var Interpreter []MPNInterpreter = []MPNInterpreter{
	KEMET_MLCC,
	TDK_MLCC,
	KYOSERA_AVX_MLCC,
	MURATA_MLCC,
}

/*╔══════════════ Multilayer Ceramic Chip Capacitors ══════════════╗*/

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
	} else if exp == 4 {
		return Capacitance{value / 100, "uF"}
	} else if exp == 5 {
		return Capacitance{value / 10, "uF"}
	} else if exp == 6 {
		return Capacitance{value, "uF"}
	} else if exp == 8 {
		return Capacitance{value / 100, "pF"}
	} else if exp == 9 {
		return Capacitance{value / 10, "pF"}
	} else {
		return Capacitance{value, "pF"}
	}
}

func CaseCodeToEIA(s string) string {
	switch s {
	case "1005":
		return "0402"
	case "1608":
		return "0603"
	case "2012":
		return "0805"
	case "3216":
		return "1206"
	case "3225":
		return "1210"
	case "4532":
		return "1812"
	case "5750":
		return "2220"
	}
	return ""
}

func transparent(s string) string {
	return s
}

/*╔══════════════ KEMET ══════════════╗*/

var (
	KEMET_MLCC MPNInterpreter = MPNInterpreter{
		Pattern:      `^([A-Z])(\d{4})([A-Z])(\d{3})([A-Z])(\d)([A-Z])([A-Z])([A-Z])([A-Z]{2}|\d{4})?$`,
		Manufacturer: "KEMET",
		Family:       "Multilayer Ceramic Capacitors MLCC - SMD/SMT",
		Specs: map[int]string{
			1:  "Ceramic",
			2:  "Dimensions",
			3:  "Specification/Series",
			4:  "Capacitance",
			5:  "Capacitance Tolerance",
			6:  "Rated Voltage (VDC)",
			7:  "Dielectric",
			8:  "Failure Rate/Design",
			9:  "Termination Finish",
			10: "Packaging",
		},
		MLCC: MLCC{
			Capacitance: DecodeCapacitance,
			VDC: map[string]float64{
				"9": 6.3,
				"8": 10,
				"4": 16,
				"3": 25,
				"6": 35,
				"5": 50,
				"1": 100,
				"2": 200,
				"A": 250,
			},
			Dielectric: KemetMLCCDielectric,
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
			CaseCode: transparent,
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

func KemetMLCCDielectric(s string) string {
	switch s {
	case "G":
		return "C0G"
	case "R":
		return "X7R"
	case "P":
		return "X5R"
	}
	return ""
}

/*╚═══════════════════════════════════╝*/

/*╔══════════════ TDK ══════════════╗*/

var (
	TDK_MLCC MPNInterpreter = MPNInterpreter{
		Pattern:      `^([A-Z])(\d{4})([A-Z]{1}\d{1}[A-Z]{1})(\d{1}[A-Z])(\d{3})([A-Z])(\d{3})([A-Z])([A-Z])`,
		Manufacturer: "TDK",
		Family:       "Multilayer Ceramic Capacitors MLCC - SMD/SMT",
		Specs: map[int]string{
			1: "Ceramic",
			2: "Dimensions",
			3: "Dielectric",
			4: "Rated Voltage (VDC)",
			5: "Capacitance",
			6: "Capacitance Tolerance",
			7: "Thickness",
			8: "Packaging",
			9: "Special reserved code",
		},
		MLCC: MLCC{
			Capacitance: DecodeCapacitance,
			VDC: map[string]float64{
				"0G": 4,
				"0J": 6.3,
				"1A": 10,
				"1C": 16,
				"1E": 25,
				"1V": 35,
				"1H": 50,
				"1N": 75,
				"2A": 100,
				"2E": 250,
				"2V": 350,
				"2W": 450,
				"2J": 630,
			},
			Dielectric: transparent,
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
			CaseCode: CaseCodeToEIA,
			Packaging: map[string]string{
				"A": `178mm reel, 4mm pitch`,
				"B": `178mm reel, 2mm pitch`,
				"K": `178mm reel, 8mm pitch`,
			},
		},
	}
)

/*╚═══════════════════════════════════╝*/

/*╔══════════════ KYOSERA AVX ══════════════╗*/

var (
	KYOSERA_AVX_MLCC MPNInterpreter = MPNInterpreter{
		Pattern:      `^(\d{4})(\d|[A-Z])([A-Z])(\d{3})([A-Z])([A-Z])([A-Z])(\d|[A-Z])([A-Z])`,
		Manufacturer: "Kyosera AVX",
		Family:       "Multilayer Ceramic Capacitors MLCC - SMD/SMT",
		Specs: map[int]string{
			1: "Dimensions",
			2: "Rated Voltage (VDC)",
			3: "Dielectric",
			4: "Capacitance",
			5: "Capacitance Tolerance",
			6: "Failure Rate",
			7: "Termination Finish",
			8: "Packaging",
			9: "Special code",
		},
		MLCC: MLCC{
			Capacitance: DecodeCapacitance,
			VDC: map[string]float64{
				"4": 4,
				"6": 6.3,
				"Z": 10,
				"Y": 16,
				"3": 25,
				"D": 35,
				"5": 50,
				"1": 100,
			},
			Dielectric: KYOSERA_AVX_MLCCDielectric,
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
			CaseCode: transparent,
			Packaging: map[string]string{
				"2": `7" Reel`,
				"4": `13" Reel`,
				"U": `4mm TR`,
			},
		},
	}
)

func KYOSERA_AVX_MLCCDielectric(s string) string {
	switch s {
	case "A":
		return "C0G"
	case "W":
		return "X6S"
	case "D":
		return "X5R"
	case "C":
		return "X7R"
	case "Z":
		return "X7S"
	case "F":
		return "X8R"
	case "L":
		return "X8L"
	case "G":
		return "Y5V"
	}
	return ""
}

/*╚═══════════════════════════════════╝*/

/*╔══════════════ MURATA ══════════════╗*/

var (
	MURATA_MLCC MPNInterpreter = MPNInterpreter{
		Pattern:      `^(GRM)(\d{2}|[A-Z]{2})([A-Z]|\d)([A-Z]\d|\d[A-Z])(\d[A-Z])(\d{3})([A-Z])([A-Z]\d{2})([A-Z])`,
		Manufacturer: "MURATA",
		Family:       "Multilayer Ceramic Capacitors MLCC - SMD/SMT",
		Specs: map[int]string{
			1: "Series",
			2: "Dimensions",
			3: "Thickness",
			4: "Dielectric",
			5: "Rated Voltage (VDC)",
			6: "Capacitance",
			7: "Capacitance Tolerance",
			8: "Individual Specification",
			9: "Packaging",
		},
		MLCC: MLCC{
			Capacitance: DecodeCapacitance,
			VDC: map[string]float64{
				"0E": 2.5,
				"0G": 4,
				"0J": 6.3,
				"1A": 10,
				"1C": 16,
				"1D": 20,
				"1E": 25,
				"YA": 35,
				"1H": 50,
				"1J": 63,
				"1K": 80,
				"2A": 100,
				"2E": 250,
			},
			Dielectric: MURATA_MLCCDielectric,
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
			CaseCode: MURATA_MLCC_Dimensions,
			Packaging: map[string]string{
				"L": `φ180mm Reel Plastic Tape W8P4`,
				"K": `φ330mm Reel Plastic Tape W8P4`,
				"J": `φ330mm Reel PAPER Tape W8P4`,
				"D": `φ180mm Reel PAPER Tape W8P4`,
				"V": `φ330mm Reel PAPER Tape W8P2`,
				"W": `φ180mm Reel PAPER Tape W8P2`,
			},
		},
	}
)

func MURATA_MLCC_Dimensions(s string) string {
	switch s {
	case "03":
		return "0201"
	case "15":
		return "0402"
	case "18":
		return "0603"
	case "JN":
		return "0704"
	case "21":
		return "0805"
	case "31":
		return "1206"
	case "32":
		return "1210"
	case "42":
		return "1808"
	case "43":
		return "1812"
	case "55":
		return "2220"
	}
	return ""
}

func MURATA_MLCCDielectric(s string) string {
	switch s {
	case "5C":
		return "C0G"
	case "7U":
		return "U2J"
	case "C8":
		return "X6S"
	case "R6":
		return "X5R"
	case "R7":
		return "X7R"
	case "C7":
		return "X7S"
	case "L8":
		return "X8L"
	}
	return ""
}

/*╚═══════════════════════════════════╝*/

/*╚════════════════════════════════════════════════════════════════╝*/
