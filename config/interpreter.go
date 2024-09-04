package config

type MPNInterpreter struct {
	Pattern    string
	Brand      string
	Family     string
	Specs      map[int]string
	Dimensions map[string]Dimensions
}

type Dimensions struct {
	Length            Dimension
	Width             Dimension
	Thickness         Dimension
	Bandwidth         Dimension
	SeparationMinimum Dimension
	MountingTechnique string
	Notes             string
}

type Dimension struct {
	Millimeters          float64
	Inches               float64
	MillimetersTolerance float64
	InchesTolerance      float64
}

var Interpreter []MPNInterpreter = []MPNInterpreter{KEMET_MLCC}

/*╔══════════════ KEMET ══════════════╗*/

/*╔══════════════ Multilayer Ceramic Chip Capacitors ══════════════╗*/

var (
	KEMET_MLCC MPNInterpreter = MPNInterpreter{
		Pattern: `^([A-Z])(\d{4})([A-Z])(\d{3})([A-Z])(\d)([A-Z])([A-Z])([A-Z])`,
		Brand:   "KEMET",
		Family:  "Multilayer Ceramic Chip Capacitors",
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
		Dimensions: map[string]Dimensions{
			"0201": {
				Length: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.03,
					InchesTolerance:      0.001,
				},
				Width: Dimension{
					Millimeters:          0.30,
					Inches:               0.012,
					MillimetersTolerance: 0.03,
					InchesTolerance:      0.001,
				},
				Bandwidth: Dimension{
					Millimeters:          0.15,
					Inches:               0.006,
					MillimetersTolerance: 0.05,
					InchesTolerance:      0.002,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"0402": {
				Length: Dimension{
					Millimeters:          1.00,
					Inches:               0.040,
					MillimetersTolerance: 0.05,
					InchesTolerance:      0.002,
				},
				Width: Dimension{
					Millimeters:          0.50,
					Inches:               0.020,
					MillimetersTolerance: 0.05,
					InchesTolerance:      0.002,
				},
				Bandwidth: Dimension{
					Millimeters:          0.30,
					Inches:               0.012,
					MillimetersTolerance: 0.10,
					InchesTolerance:      0.004,
				},
				SeparationMinimum: Dimension{
					Millimeters: 0.30,
					Inches:      0.012,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"0603": {
				Length: Dimension{
					Millimeters:          1.60,
					Inches:               0.063,
					MillimetersTolerance: 0.15,
					InchesTolerance:      0.006,
				},
				Width: Dimension{
					Millimeters:          0.80,
					Inches:               0.032,
					MillimetersTolerance: 0.15,
					InchesTolerance:      0.006,
				},
				Bandwidth: Dimension{
					Millimeters:          0.35,
					Inches:               0.014,
					MillimetersTolerance: 0.15,
					InchesTolerance:      0.006,
				},
				SeparationMinimum: Dimension{
					Millimeters: 0.50,
					Inches:      0.020,
				},
				MountingTechnique: "Solder Wave or Solder Reflow",
			},
			"0805": {
				Length: Dimension{
					Millimeters:          2.00,
					Inches:               0.079,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Width: Dimension{
					Millimeters:          1.25,
					Inches:               0.049,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Bandwidth: Dimension{
					Millimeters:          0.50,
					Inches:               0.02,
					MillimetersTolerance: 0.25,
					InchesTolerance:      0.010,
				},
				SeparationMinimum: Dimension{
					Millimeters: 0.70,
					Inches:      0.028,
				},
				MountingTechnique: "Solder Wave or Solder Reflow",
			},
			"1206": {
				Length: Dimension{
					Millimeters:          3.20,
					Inches:               0.126,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Width: Dimension{
					Millimeters:          1.60,
					Inches:               0.063,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Bandwidth: Dimension{
					Millimeters:          0.50,
					Inches:               0.02,
					MillimetersTolerance: 0.25,
					InchesTolerance:      0.010,
				},
				SeparationMinimum: Dimension{
					Millimeters: 1.50,
					Inches:      0.060,
				},
				MountingTechnique: "Solder Wave or Solder Reflow",
				Notes:             "For capacitance value 33 nF ≤ 50V add 0.10 (0.004) to the length tolerance dimension",
			},
			"1210": {
				Length: Dimension{
					Millimeters:          3.20,
					Inches:               0.126,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Width: Dimension{
					Millimeters:          2.50,
					Inches:               0.098,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Bandwidth: Dimension{
					Millimeters:          0.50,
					Inches:               0.02,
					MillimetersTolerance: 0.25,
					InchesTolerance:      0.010,
				},
				SeparationMinimum: Dimension{
					Millimeters: 1.50,
					Inches:      0.060,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"1805": {
				Length: Dimension{
					Millimeters:          4.50,
					Inches:               0.177,
					MillimetersTolerance: 0.50,
					InchesTolerance:      0.020,
				},
				Width: Dimension{
					Millimeters:          1.27,
					Inches:               0.050,
					MillimetersTolerance: 0.30,
					InchesTolerance:      0.015,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 2.90,
					Inches:      0.114,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"1808": {
				Length: Dimension{
					Millimeters:          4.70,
					Inches:               0.185,
					MillimetersTolerance: 0.50,
					InchesTolerance:      0.020,
				},
				Width: Dimension{
					Millimeters:          2.00,
					Inches:               0.079,
					MillimetersTolerance: 0.20,
					InchesTolerance:      0.008,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 2.90,
					Inches:      0.114,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"1812": {
				Length: Dimension{
					Millimeters:          4.50,
					Inches:               0.177,
					MillimetersTolerance: 0.30,
					InchesTolerance:      0.012,
				},
				Width: Dimension{
					Millimeters:          3.20,
					Inches:               0.126,
					MillimetersTolerance: 0.30,
					InchesTolerance:      0.012,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 2.30,
					Inches:      0.091,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"1825": {
				Length: Dimension{
					Millimeters:          4.50,
					Inches:               0.177,
					MillimetersTolerance: 0.30,
					InchesTolerance:      0.012,
				},
				Width: Dimension{
					Millimeters:          6.40,
					Inches:               0.252,
					MillimetersTolerance: 0.40,
					InchesTolerance:      0.016,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 2.30,
					Inches:      0.091,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"2220": {
				Length: Dimension{
					Millimeters:          5.70,
					Inches:               0.224,
					MillimetersTolerance: 0.40,
					InchesTolerance:      0.016,
				},
				Width: Dimension{
					Millimeters:          5.00,
					Inches:               0.197,
					MillimetersTolerance: 0.40,
					InchesTolerance:      0.016,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 3.50,
					Inches:      0.138,
				},
				MountingTechnique: "Solder Reflow Only",
			},
			"2225": {
				Length: Dimension{
					Millimeters:          5.60,
					Inches:               0.220,
					MillimetersTolerance: 0.40,
					InchesTolerance:      0.016,
				},
				Width: Dimension{
					Millimeters:          6.40,
					Inches:               0.248,
					MillimetersTolerance: 0.40,
					InchesTolerance:      0.016,
				},
				Bandwidth: Dimension{
					Millimeters:          0.60,
					Inches:               0.024,
					MillimetersTolerance: 0.35,
					InchesTolerance:      0.014,
				},
				SeparationMinimum: Dimension{
					Millimeters: 3.20,
					Inches:      0.126,
				},
				MountingTechnique: "Solder Reflow Only",
			},
		},
	}
)

/*╚════════════════════════════════════════════════════════════════╝*/

/*╚═══════════════════════════════════╝*/
