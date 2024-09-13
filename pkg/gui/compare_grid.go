package gui

import (
	"config"
	"core"
	"fmt"
	"strconv"
	"strings"

	"github.com/gotk3/gotk3/gtk"
)

var Grids [4]*gtk.Grid

func createCompareGrid(parentBox *gtk.Box) {
	if config.DEBUGGING {
		defer core.StartBenchmark("gui.createCompareGrid()", true).Stop()
	}
	diffSummary := []string{strconv.Itoa(core.Filters.InsertCount), strconv.Itoa(core.Filters.UpdateCount), strconv.Itoa(core.Filters.DeleteCount), strconv.Itoa(core.Filters.EqualCount)}
	operator := []string{"INSERT", "UPDATE", "DELETE", "EQUAL"}
	opColor := []string{config.INSERT_BG_COLOR, config.NEW_UPDATE_BG_COLOR, config.DELETE_BG_COLOR, "#adadad"}
	for op := range operator {
		expander, _ := gtk.ExpanderNew(operator[op] + " - ⚐ " + diffSummary[op])
		expander.SetExpanded(true)
		Grids[op] = createTightGrid()
		className := fmt.Sprintf("cell-%s", strings.ToLower(operator[op]))
		applyCSS(Grids[op], fmt.Sprintf(`
		#grid label {
			padding: 5px;
		}
		#grid .%s {
			background-color: %s;
		}
    `, className, opColor[op]))
		createGridHeaders([]string{"Quantity", "Manufacturer Part Number", "Designator", "Description", config.INFO_BTN_CHAR}, Grids[op])
		i := 0
		for compIdx, component := range core.Components {
			if component.Operator == operator[op] {
				quantityText := strconv.Itoa(component.Quantity)
				if component.Operator == "UPDATE" {
					quantityText = strconv.Itoa(component.OldQuantity) + " → " + strconv.Itoa(component.NewQuantity)
				}
				quantityLabel := createLabel(quantityText)
				context, _ := quantityLabel.GetStyleContext()
				context.AddClass(className)
				wrapText(quantityLabel, 80)
				Grids[op].Attach(quantityLabel, 0, i+1, 1, 1)
				mpnLabel := createLabel(component.Mpn)
				context, _ = mpnLabel.GetStyleContext()
				context.AddClass(className)
				wrapText(mpnLabel, 80)
				Grids[op].Attach(mpnLabel, 1, i+1, 1, 1)
				designatorLabel := createLabel(component.Designator)
				context, _ = designatorLabel.GetStyleContext()
				context.AddClass(className)
				wrapText(designatorLabel, 80)
				Grids[op].Attach(designatorLabel, 2, i+1, 1, 1)
				descriptionLabel := createLabel(component.UserDescription)
				context, _ = descriptionLabel.GetStyleContext()
				context.AddClass(className)
				wrapText(descriptionLabel, 80)
				Grids[op].Attach(descriptionLabel, 3, i+1, 1, 1)
				if !component.Analyzed {
					compButton := createButton(" ")
					Grids[op].Attach(compButton, 4, i+1, 1, 1)
				} else {
					compButton := createButton(config.INFO_BTN_CHAR)
					compButton.Connect("clicked", func() {
						ShowComponent(compIdx)
					})
					Grids[op].Attach(compButton, 4, i+1, 1, 1)
				}
				i++
			}
		}
		centerBox := createBox(gtk.ORIENTATION_HORIZONTAL, 0)
		addBoxMargin(centerBox)
		centerBox.PackStart(Grids[op], true, false, 0)
		expander.Add(centerBox)
		parentBox.PackStart(expander, false, false, 0)
	}
}
