package export

import (
	"config"
	"core"
	"strings"

	"github.com/jung-kurt/gofpdf"
)

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

func writeTitle(text string, pdf *gofpdf.Fpdf, font, style string, fontSize, lineJump float64, tr func(string) string) {
	pdf.SetFont(font, style, fontSize)
	pdf.Cell(0, 10, tr(text))
	pdf.Ln(lineJump)
}

func writeHeaders(headers []string, widths []float64, pdf *gofpdf.Fpdf) {
	pdf.SetFont("Courier", "B", 10)
	for i, header := range headers {
		if header != config.INFO_BTN_CHAR {
			pdf.CellFormat(widths[i], 7, header, "1", 0, "", false, 0, "")
		}
	}
	pdf.Ln(-1)
}

func getMaxHeight(RowsAttributes []core.ComponentMethod, component core.Component, pdf *gofpdf.Fpdf, widths []float64) float64 {
	maxHeight := 0.0
	for i, attr := range RowsAttributes {
		value := attr(&component)
		lines := pdf.SplitText(value, widths[i])
		height := float64(len(lines))
		if height > maxHeight {
			maxHeight = height
		}
	}
	return maxHeight
}

func jumpPageChecker(pdf *gofpdf.Fpdf, maxHeight float64) {
	_, pageHeight := pdf.GetPageSize()
	yPos := pdf.GetY()
	left, top, _, bot := pdf.GetMargins()
	if yPos+maxHeight*6 > pageHeight-bot {
		pdf.AddPage()
		pdf.SetXY(left, top)
	}
}

func writeAttributes(RowsAttributes []core.ComponentMethod, pdf *gofpdf.Fpdf, component core.Component, widths []float64, maxHeight float64, tr func(string) string) {
	for i, attr := range RowsAttributes {
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
}

func getMaxHeightRow(attachmentsIter []core.Component, attachments []core.Attachment, pdf *gofpdf.Fpdf, widths []float64) []float64 {
	maxHeight := 0.0
	maxHeightRow := []float64{}
	for _, attachment := range attachmentsIter {
		emptyAttributes := [2]core.Attachment{}
		attributes := append(emptyAttributes[:], attachments...)
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
	return maxHeightRow
}

func getMaxHeightRowMsg(attachmentsIterMsg []string, attachments []core.Attachment, pdf *gofpdf.Fpdf, widths []float64) []float64 {
	maxHeight := 0.0
	maxHeightRow := []float64{}
	for _, msg := range attachmentsIterMsg {
		emptyAttributes := [3]core.Attachment{}
		attributes := append(emptyAttributes[:], attachments...)
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
	return maxHeightRow
}

func jumpPageCheckerAttr(pdf *gofpdf.Fpdf, maxHeightRow []float64) {
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
}

func writeAttachments(attachmentsIter []core.Component, attachments []core.Attachment, pdf *gofpdf.Fpdf, widths []float64, maxHeightRow []float64) {
	for j, attachment := range attachmentsIter {
		emptyAttributes := [2]core.Attachment{}
		attributes := append(emptyAttributes[:], attachments...)
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

func writeAttachmentsMsg(attachmentsIter []string, attachments []core.Attachment, pdf *gofpdf.Fpdf, widths []float64, maxHeightRow []float64) {
	for j, msg := range attachmentsIter {
		emptyAttributes := [3]core.Attachment{}
		attributes := append(emptyAttributes[:], attachments...)
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
