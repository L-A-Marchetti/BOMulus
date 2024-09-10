package export

import (
	"core"

	"github.com/jung-kurt/gofpdf"
)

func ExportToPDF(filename string, grids ...core.ReportGrid) error {
	pdf := gofpdf.New("L", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()
	waterMark(pdf)
	writeTitle("Analysis Report", pdf, "Courier", "B", 16, 15, tr)
	for _, grid := range grids {
		if len(grid.Components) != 0 {
			writeTitle(grid.ExpanderName, pdf, "Courier", "B", 14, 10, tr)
			widths := calculateColumnWidths(pdf, grid.Headers)
			writeHeaders(grid.Headers, widths, pdf)
			// Add data rows
			pdf.SetFont("Courier", "", 10)
			for _, component := range grid.Components {
				maxHeight := getMaxHeight(grid.RowsAttributes, component, pdf, widths)
				jumpPageChecker(pdf, maxHeight)
				writeAttributes(grid.RowsAttributes, pdf, component, widths, maxHeight, tr)
				// Handle attachments
				if grid.AttachmentsIter != nil {
					maxHeightRow := getMaxHeightRow(grid.AttachmentsIter(&component), grid.Attachments, pdf, widths)
					jumpPageCheckerAttr(pdf, maxHeightRow)
					writeAttachments(grid.AttachmentsIter(&component), grid.Attachments, pdf, widths, maxHeightRow)
				}
				// Handle message attachments
				if grid.AttachmentsIterMsg != nil {
					maxHeightRow := getMaxHeightRowMsg(grid.AttachmentsIterMsg(&component), grid.Attachments, pdf, widths)
					jumpPageCheckerAttr(pdf, maxHeightRow)
					writeAttachmentsMsg(grid.AttachmentsIterMsg(&component), grid.Attachments, pdf, widths, maxHeightRow)
				}
			}
			pdf.Ln(10)
		}
	}
	return pdf.OutputFileAndClose(filename)
}
