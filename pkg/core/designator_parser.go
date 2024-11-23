package core

import "strings"

func designator_parser(designators string) []Designator {
	var d []Designator
	splitted := strings.Split(designators, ", ")
	for i := range splitted {
		tmp := Designator{
			Designator: splitted[i],
			Label:      "not assigned",
		}
		d = append(d, tmp)
	}
	return d
}
