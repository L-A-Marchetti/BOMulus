package export

import (
	"config"
	"core"
	"strings"

	"github.com/jung-kurt/gofpdf"
)

func ExportToPDF(filename string, grids ...core.ReportGrid) error {
	pdf := gofpdf.New("L", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.AddPage()

	waterMark(pdf)

	// Set up some default styling
	pdf.SetFont("Courier", "B", 16)
	pdf.SetTextColor(0, 0, 0)

	// Title
	pdf.Cell(0, 10, "Analysis Report")
	pdf.Ln(15)

	for _, grid := range grids {
		if len(grid.Components) != 0 {
			// Add grid title
			pdf.SetFont("Courier", "B", 14)
			pdf.Cell(0, 10, tr(grid.ExpanderName))
			pdf.Ln(10)

			// Set up the table
			pdf.SetFont("Courier", "B", 10)
			widths := calculateColumnWidths(pdf, grid.Headers)

			// Add headers
			for i, header := range grid.Headers {
				if header != config.INFO_BTN_CHAR {
					pdf.CellFormat(widths[i], 7, header, "1", 0, "", false, 0, "")
				}
			}
			pdf.Ln(-1)

			// Add data rows
			pdf.SetFont("Courier", "", 10)
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
				_, pageHeight := pdf.GetPageSize()
				yPos := pdf.GetY()
				left, top, _, bot := pdf.GetMargins()
				if yPos+maxHeight*6 > pageHeight-bot {
					pdf.AddPage()
					pdf.SetXY(left, top)
				}
				for i, attr := range grid.RowsAttributes {
					startX, startY := pdf.GetXY()
					value := attr(&component)
					lines := pdf.SplitText(value, widths[i])
					for len(lines) <= int(maxHeight) {
						lines = append(lines, "")
					}
					pdf.MultiCell(widths[i], 6, tr(strings.Join(lines, "\n")), "1", "", false)
					pdf.SetXY(startX+widths[i], startY)
				}
				pdf.Ln(maxHeight * 6)

				// Handle attachments
				if grid.AttachmentsIter != nil {
					maxHeight := 0.0
					maxHeightRow := []float64{}
					for _, attachment := range grid.AttachmentsIter(&component) {
						emptyAttributes := [2]core.Attachment{}
						attributes := append(emptyAttributes[:], grid.Attachments...)
						for i, attach := range attributes {
							maxHeight = 1.0
							if i > 1 {
								value := attach.Attribute(&attachment)
								lines := pdf.SplitText(value, widths[i])
								height := float64(len(lines))
								if height > maxHeight {
									maxHeight = height
								}
							}
						}
						maxHeightRow = append(maxHeightRow, maxHeight)
					}
					_, pageHeight := pdf.GetPageSize()
					yPos := pdf.GetY()
					left, top, _, bot := pdf.GetMargins()
					maxHeightAttr := 0.0
					for _, num := range maxHeightRow {
						if num > maxHeightAttr {
							maxHeightAttr = num
						}
					}
					if yPos+maxHeightAttr*6 > pageHeight-bot {
						pdf.AddPage()
						pdf.SetXY(left, top)
					}
					for j, attachment := range grid.AttachmentsIter(&component) {
						emptyAttributes := [2]core.Attachment{}
						attributes := append(emptyAttributes[:], grid.Attachments...)
						for i, attach := range attributes {
							if i < 2 {
								pdf.CellFormat(widths[i], 6, "", "", 0, "", false, 0, "")
							} else {
								startX, startY := pdf.GetXY()
								value := attach.Attribute(&attachment)
								lines := pdf.SplitText(value, widths[attach.Column])
								for len(lines) <= int(maxHeightRow[j]) {
									lines = append(lines, "")
								}
								pdf.MultiCell(widths[attach.Column], 6, strings.Join(lines, "\n"), "1", "", false)
								pdf.SetXY(startX+widths[attach.Column], startY)
							}
						}
						pdf.Ln(maxHeightRow[j] * 6)
					}
				}

				// Handle message attachments
				if grid.AttachmentsIterMsg != nil {
					maxHeight := 0.0
					maxHeightRow := []float64{}
					for _, msg := range grid.AttachmentsIterMsg(&component) {
						emptyAttributes := [3]core.Attachment{}
						attributes := append(emptyAttributes[:], grid.Attachments...)
						for i, attach := range attributes {
							maxHeight = 1.0
							if i > 2 {
								value := attach.AttributeMsg(msg)
								lines := pdf.SplitText(value, widths[i])
								height := float64(len(lines))
								if height > maxHeight {
									maxHeight = height
								}
							}
						}
						maxHeightRow = append(maxHeightRow, maxHeight)
					}
					_, pageHeight := pdf.GetPageSize()
					yPos := pdf.GetY()
					left, top, _, bot := pdf.GetMargins()
					maxHeightAttr := 0.0
					for _, num := range maxHeightRow {
						if num > maxHeightAttr {
							maxHeightAttr = num
						}
					}
					if yPos+maxHeightAttr*6 > pageHeight-bot {
						pdf.AddPage()
						pdf.SetXY(left, top)
					}
					for j, msg := range grid.AttachmentsIterMsg(&component) {
						emptyAttributes := [3]core.Attachment{}
						attributes := append(emptyAttributes[:], grid.Attachments...)
						for i, attach := range attributes {
							if i < 3 {
								pdf.CellFormat(widths[i], 6, "", "", 0, "", false, 0, "")
							} else {
								startX, startY := pdf.GetXY()
								pdf.SetXY(startX, startY-6)
								value := attach.AttributeMsg(msg)
								lines := pdf.SplitText(value, widths[attach.Column])
								for len(lines) <= int(maxHeightRow[j]) {
									lines = append(lines, "")
								}
								pdf.MultiCell(widths[attach.Column], 6, strings.Join(lines, "\n"), "1", "", false)
								pdf.SetXY(startX+widths[attach.Column], startY)
							}
						}
						pdf.Ln(maxHeightRow[j] * 6)
					}
				}

			}

			pdf.Ln(10)
		}
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

func waterMark(pdf *gofpdf.Fpdf) {
	imgWidth, imgHeight := 10.0, 10.0
	pageWidth, _ := pdf.GetPageSize()
	_, margTop, margRight, _ := pdf.GetMargins()
	x := pageWidth - margRight - imgWidth
	y := margTop
	pdf.Image("assets/logo.png", x, y, imgWidth, imgHeight, false, "", 0, "")
}
