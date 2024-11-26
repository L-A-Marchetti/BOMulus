/*
* Package: core
* File: designator_parser.go
*
* Description:
* This file contains a function for parsing designator strings and converting
* them into a slice of Designator structures. It splits a comma-separated
* string of designators and creates a Designator object for each one.
*
* Input:
* - designators (string): A comma-separated string of designators.
*
* Output:
* - []Designator: A slice of Designator structures, each containing the
*   original designator string and an initial label set to "not assigned".
*
* Note:
* This function assumes that the input string is properly formatted with
* designators separated by ", ". It initializes each Designator's Label
* field to "not assigned", which can be modified later if needed.
 */

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
