package core

import (
	"reflect"
	"testing"
)

func TestXlsmDiff(t *testing.T) {
	testCases := []struct {
		name               string
		newComponents      []Component
		oldComponents      []Component
		expectedComponents []Component
		expectedFilters    Filter
	}{
		{
			name: "Equal components",
			newComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			oldComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			expectedComponents: []Component{
				{Mpn: "MPN123", Quantity: 10, Operator: "EQUAL"},
			},
			expectedFilters: Filter{EqualCount: 1, OldQuantity: 10, NewQuantity: 10},
		},
		{
			name: "Updated components",
			newComponents: []Component{
				{Mpn: "MPN123", Quantity: 15},
			},
			oldComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			expectedComponents: []Component{
				{Mpn: "MPN123", Quantity: 15, Operator: "UPDATE", OldQuantity: 10, NewQuantity: 15},
			},
			expectedFilters: Filter{UpdateCount: 1, OldQuantity: 10, NewQuantity: 15},
		},
		{
			name: "Inserted components",
			newComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
				{Mpn: "MPN456", Quantity: 5},
			},
			oldComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			expectedComponents: []Component{
				{Mpn: "MPN123", Quantity: 10, Operator: "EQUAL"},
				{Mpn: "MPN456", Quantity: 5, Operator: "INSERT"},
			},
			expectedFilters: Filter{EqualCount: 1, InsertCount: 1, OldQuantity: 10, NewQuantity: 15},
		},
		{
			name:          "Deleted components",
			newComponents: []Component{},
			oldComponents: []Component{
				{Mpn: "MPN123", Quantity: 10},
			},
			expectedComponents: []Component{
				{Mpn: "MPN123", Quantity: 10, Operator: "DELETE"},
			},
			expectedFilters: Filter{DeleteCount: 1, OldQuantity: 10},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			Filters[1] = Filter{}
			Components = nil
			// Set global variables for the test case
			NewComponents = tc.newComponents
			OldComponents = tc.oldComponents

			// Call the function to be tested
			XlsmDiff()

			// Check if the result matches expected components
			if !reflect.DeepEqual(Components, tc.expectedComponents) {
				t.Errorf("For %s, Got Components: %v, Want Components: %v", tc.name, Components, tc.expectedComponents)
			}

			// Check if the filters match expected values
			if !reflect.DeepEqual(Filters[1], tc.expectedFilters) {
				t.Errorf("For %s, Got Filters[1]: %v, Want Filters[1]: %v", tc.name, Filters[1], tc.expectedFilters)
			}
		})
	}
}
