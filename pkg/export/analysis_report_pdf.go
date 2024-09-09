package export

import (
	"config"
	"core"
	"strings"

	"github.com/jung-kurt/gofpdf"
)

func ExportToPDF(filename string, grids ...core.ReportGrid) error {
	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()

	// Set up some default styling
	pdf.SetFont("Arial", "B", 16)
	pdf.SetTextColor(0, 0, 0)

	// Title
	pdf.Cell(0, 10, "Analysis Report")
	pdf.Ln(15)

	for _, grid := range grids {
		// Add grid title
		pdf.SetFont("Arial", "B", 14)
		pdf.Cell(0, 10, grid.ExpanderName)
		pdf.Ln(10)

		// Set up the table
		pdf.SetFont("Arial", "B", 10)
		widths := calculateColumnWidths(pdf, grid.Headers)

		// Add headers
		for i, header := range grid.Headers {
			if header != config.INFO_BTN_CHAR {
				pdf.CellFormat(widths[i], 7, header, "1", 0, "", false, 0, "")
			}
		}
		pdf.Ln(-1)

		// Add data rows
		pdf.SetFont("Arial", "", 10)
		for _, component := range grid.Components {
			maxHeight := 0.0
			for i, attr := range grid.RowsAttributes {
				value := attr(&component)
				lines := pdf.SplitText(value, widths[i])
				height := float64(len(lines))
				if height > maxHeight {
					maxHeight = height
				}
			}
			for i, attr := range grid.RowsAttributes {
				startX, startY := pdf.GetXY()
				value := attr(&component)
				lines := pdf.SplitText(value, widths[i])
				for len(lines) <= int(maxHeight) {
					lines = append(lines, "")
				}
				pdf.MultiCell(widths[i], 6, strings.Join(lines, "\n"), "1", "", false)
				pdf.SetXY(startX+widths[i], startY)
			}
			pdf.Ln(maxHeight * 6)

			// Handle attachments
			if grid.AttachmentsIter != nil {
				for _, attachment := range grid.AttachmentsIter(&component) {
					for i, attach := range grid.Attachments {
						value := attach.Attribute(&attachment)
						if i == 0 {
							pdf.CellFormat(widths[0], 6, "", "1", 0, "", false, 0, "")
						}
						pdf.CellFormat(widths[attach.Column], 6, value, "1", 0, "", false, 0, "")
					}
					pdf.Ln(-1)
				}
			}

			// Handle message attachments
			if grid.AttachmentsIterMsg != nil {
				for _, msg := range grid.AttachmentsIterMsg(&component) {
					for i, attach := range grid.Attachments {
						value := attach.AttributeMsg(msg)
						if i == 0 {
							pdf.CellFormat(widths[0], 6, "", "1", 0, "", false, 0, "")
						}
						pdf.CellFormat(widths[attach.Column], 6, value, "1", 0, "", false, 0, "")
					}
					pdf.Ln(-1)
				}
			}
		}

		pdf.Ln(10)
	}

	return pdf.OutputFileAndClose(filename)
}

func calculateColumnWidths(pdf *gofpdf.Fpdf, headers []string) []float64 {
	pageWidth, _ := pdf.GetPageSize()
	tableWidth := pageWidth - 20 // Margin on both sides
	numColumns := len(headers)

	// Calculate proportional widths based on header length
	totalLength := 0
	for _, header := range headers {
		totalLength += len(header)
	}

	widths := make([]float64, numColumns)
	for i, header := range headers {
		widths[i] = float64(len(header)) / float64(totalLength) * tableWidth
	}

	return widths
}
