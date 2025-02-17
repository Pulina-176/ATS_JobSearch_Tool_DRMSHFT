import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function createPdf(jobTitles, countries, platforms, links) {
    if (
      jobTitles.length !== countries.length ||
      jobTitles.length !== platforms.length ||
      jobTitles.length !== links.length
    ) {
      console.error("All input arrays must have the same length.");
      return;
    }
  
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const titleFontSize = 18;
    const headerFontSize = 11;
    const fontSize = 9; // Slightly smaller for URLs
    let yPosition = height - 50;
    const margin = 40;
    const rowHeight = 40; // Increased for multi-line URLs
    const colWidths = [40, 150, 70, 80, 180]; // Wider column for links
    
    // Title with better styling
    page.drawText("Job List", {
      x: width / 2 - 30, // Centered
      y: yPosition,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  
    yPosition -= 40; // More space after title
    
    // Function for text wrapping - improved for URLs
    function wrapText(text, maxWidth, currentFont, currentFontSize) {
      if (!text) return [""];
      
      // Special handling for URLs - check if it's a URL
      if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('www.')) {
        const chars = text.split('');
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < chars.length; i++) {
          const char = chars[i];
          const width = currentFont.widthOfTextAtSize(currentLine + char, currentFontSize);
          
          if (width < maxWidth) {
            currentLine += char;
          } else {
            lines.push(currentLine);
            currentLine = char;
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      }
      
      // Normal text wrapping for non-URLs
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = currentFont.widthOfTextAtSize(currentLine + ' ' + word, currentFontSize);
        
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      
      lines.push(currentLine);
      return lines;
    }
    
    // Modified function to calculate required height for multi-line content
    function calculateRequiredHeight(text, maxWidth, currentFont, currentFontSize) {
      const lines = wrapText(text, maxWidth, currentFont, currentFontSize);
      return lines.length * (currentFontSize + 2) + 10; // 10px padding
    }
    
    // Function to draw table cell with wrapped text
    function drawTextInCell(pageObj, text, x, y, width, height, fontObj, fontSize, isHeader = false) {
      const textColor = rgb(0, 0, 0);
      const maxWidth = width - 10; // Padding on both sides
      const lines = wrapText(text, maxWidth, fontObj, fontSize);
      
      // Calculate vertical position for text to be vertically centered
      const totalTextHeight = lines.length * (fontSize + 2);
      let textY = y - (height - totalTextHeight) / 2 - fontSize;
      
      // If it's a header, align to top with some padding
      if (isHeader) {
        textY = y - 12;
      }
      
      lines.forEach(line => {
        pageObj.drawText(line, {
          x: x + 5,
          y: textY,
          size: fontSize,
          font: fontObj,
          color: textColor,
        });
        textY -= (fontSize + 2);
      });
    }
    
    // Draw table background for headers
    let xPosition = margin;
    let totalWidth = 0;
    colWidths.forEach(width => {
      totalWidth += width;
    });
    
    page.drawRectangle({
      x: margin,
      y: yPosition - rowHeight,
      width: totalWidth,
      height: rowHeight,
      color: rgb(0.9, 0.9, 0.9), // Light gray background for headers
    });
    
    // Draw Table Headers with better styling
    xPosition = margin;
    const headers = ["S/N", "Job Title", "Country", "Platform", "Link"];
    headers.forEach((header, index) => {
      drawTextInCell(page, header, xPosition, yPosition, colWidths[index], rowHeight, boldFont, headerFontSize, true);
      
      // Draw borders
      page.drawRectangle({
        x: xPosition,
        y: yPosition - rowHeight,
        width: colWidths[index],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      
      xPosition += colWidths[index];
    });
    
    yPosition -= rowHeight;
    
    // Table Data with improved styling and handling for multi-line content
    for (let i = 0; i < jobTitles.length; i++) {
      // Calculate required height for this row (based on content)
      const linkText = links[i] || "";
      const linkMaxWidth = colWidths[4] - 10;
      const requiredLinkHeight = calculateRequiredHeight(linkText, linkMaxWidth, font, fontSize);
      const currentRowHeight = Math.max(rowHeight, requiredLinkHeight);
      
      // Check if we need a new page
      if (yPosition < 50 + currentRowHeight) {
        // Add a new page
        page = pdfDoc.addPage([600, 800]);
        yPosition = height - 50;
        
        // Draw header background
        page.drawRectangle({
          x: margin,
          y: yPosition - rowHeight,
          width: totalWidth,
          height: rowHeight,
          color: rgb(0.9, 0.9, 0.9),
        });
        
        // Recreate table headers on new page
        xPosition = margin;
        headers.forEach((header, index) => {
          drawTextInCell(page, header, xPosition, yPosition, colWidths[index], rowHeight, boldFont, headerFontSize, true);
          
          // Draw borders
          page.drawRectangle({
            x: xPosition,
            y: yPosition - rowHeight,
            width: colWidths[index],
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });
          
          xPosition += colWidths[index];
        });
        
        yPosition -= rowHeight;
      }
      
      // Alternating row colors for better readability
      if (i % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: yPosition - currentRowHeight,
          width: totalWidth,
          height: currentRowHeight,
          color: rgb(0.95, 0.95, 0.95), // Very light gray for even rows
        });
      }
      
      const rowData = [
        (i + 1).toString(),
        jobTitles[i] || "",
        countries[i] || "",
        platforms[i] || "",
        links[i] || "",
      ];
      
      xPosition = margin;
      rowData.forEach((text, index) => {
        drawTextInCell(page, text, xPosition, yPosition, colWidths[index], currentRowHeight, font, fontSize);
        
        // Draw borders - with dynamic height
        page.drawRectangle({
          x: xPosition,
          y: yPosition - currentRowHeight,
          width: colWidths[index],
          height: currentRowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
        
        xPosition += colWidths[index];
      });
      
      yPosition -= currentRowHeight;
    }
    
    // Add footer with page numbers
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      
      page.drawText(`Page ${i + 1} of ${pageCount}`, {
        x: width - 100,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      const date = new Date().toLocaleDateString();
      page.drawText(`Generated on: ${date}`, {
        x: margin,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);
    
    // Create a temporary link to download
    const link = document.createElement("a");
    link.href = docUrl;
    link.download = "Job_List.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return docUrl;
  }

export {createPdf};