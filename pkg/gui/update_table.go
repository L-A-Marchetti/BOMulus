package gui

/*
func updateTableRow() {
	iter, ok := resultStore.GetIterFirst()
	if !ok {
		return
	}
	for {
		processRow(iter)
		if !resultStore.IterNext(iter) {
			break
		}
	}
	refreshUI()
}

func processRow(iter *gtk.TreeIter) {
	newRow := getColumnValue(iter, 2)
	oldRow := getColumnValue(iter, 1)
	if newRow != "" {
		processNewRow(iter, newRow)
	} else if oldRow != "" {
		processOldRow(iter, oldRow)
	}
}

func getColumnValue(iter *gtk.TreeIter, column int) string {
	value, err := resultStore.GetValue(iter, column)
	core.ErrorsHandler(err)
	goValue, err := value.GoValue()
	core.ErrorsHandler(err)
	return goValue.(string)
}

func processNewRow(iter *gtk.TreeIter, newRow string) {
	processRowCommon(iter, newRow, false)
}

func processOldRow(iter *gtk.TreeIter, oldRow string) {
	processRowCommon(iter, oldRow, true)
}

func processRowCommon(iter *gtk.TreeIter, rowValue string, isOld bool) {
	intRow, err := strconv.Atoi(rowValue)
	core.ErrorsHandler(err)
	compIdx := components.FindComponentRowId(intRow, isOld)
	if compIdx >= 0 && compIdx < len(core.Components) && core.Components[compIdx].Analyzed {
		err = resultStore.SetValue(iter, 3, config.INFO_BTN_CHAR)
		core.ErrorsHandler(err)
	}
}

func refreshUI() {
	glib.IdleAdd(func() {
		if treeView, err := gtk.TreeViewNew(); err == nil {
			treeView.QueueDraw()
		}
	})
}
*/
