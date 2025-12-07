
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun, VerticalAlign } from "docx";
import { ReportData } from "../types";

// Removed logoPath as it is no longer required for DOCX
const signaturePath = 'images/signature.png';

// Helper to get image data from either Base64 or a URL path
const getImageData = async (src: string | null): Promise<{ data: Uint8Array; type: "png" | "jpg" | "gif" | "bmp" } | null> => {
  if (!src) return null;

  try {
    let data: Uint8Array;
    let type: "png" | "jpg" | "gif" | "bmp" = "png";

    // If it's a data URL (Base64)
    if (src.startsWith('data:')) {
      const arr = src.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || "";
      
      if (mime.includes('jpeg') || mime.includes('jpg')) type = "jpg";
      else if (mime.includes('png')) type = "png";
      else if (mime.includes('gif')) type = "gif";
      else if (mime.includes('bmp')) type = "bmp";

      const dataStr = arr.length > 1 ? arr[1] : arr[0];
      const binaryString = window.atob(dataStr);
      const len = binaryString.length;
      data = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          data[i] = binaryString.charCodeAt(i);
      }
    } 
    // If it's a file path
    else {
      const lower = src.toLowerCase();
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) type = "jpg";
      else if (lower.endsWith('.gif')) type = "gif";
      else if (lower.endsWith('.bmp')) type = "bmp";

      const response = await fetch(src);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      data = new Uint8Array(buffer);
    }
    return { data, type };
  } catch (e) {
    console.error("Error loading image for DOCX", e);
    return null;
  }
};

export const generateDocx = async (data: ReportData): Promise<Blob> => {
  // Styles
  const titleFont = data.fonts.title;
  const headerFont = data.fonts.headers;
  const bodyFont = data.fonts.body;
  
  const size = 22; // 11pt
  
  const createBoldText = (text: string) => new TextRun({ text, font: headerFont, size, bold: true });
  const createNormalText = (text: string) => new TextRun({ text, font: bodyFont, size });
  const createUnderlineBold = (text: string) => new TextRun({ text, font: headerFont, size, bold: true, underline: { type: "single" } });

  // Load signature image only
  const signatureImg = await getImageData(signaturePath);

  // Table Cell Helper with margins
  const createCell = (text: string, fill: string, widthPercent: number, bold: boolean = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { fill: fill, type: ShadingType.CLEAR, color: "auto" },
      verticalAlign: VerticalAlign.CENTER,
      margins: {
         top: 100,
         bottom: 100,
         left: 100,
         right: 100,
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text, font: bodyFont, size: 20, bold })], // slightly smaller than body text
          alignment: "center",
        }),
      ],
    });
  };

  const orangeColor = "FFA500";
  const mapColor = (cls: string) => {
      if (cls.includes('green')) return "4CAF50";
      if (cls.includes('cyan')) return "00FFFF";
      if (cls.includes('orange')) return "FFA500";
      if (cls.includes('yellow')) return "FFFF00";
      return "E0E0E0";
  };

  const yellowColor = "FFFF00";

  // Build dynamic table rows
  const tableRows = [
      new TableRow({
        children: [
          createCell("Point No", orangeColor, 10, true),
          createCell("Depth Recommended", orangeColor, 20, true),
          createCell("Expected Yield", orangeColor, 25, true),
          createCell("Expected Layers", orangeColor, 25, true),
          createCell("Recommended PVC Casing", orangeColor, 20, true),
        ]
      }),
      new TableRow({
        children: [
          createCell("Code", orangeColor, 10, true),
          createCell("(Feet)", orangeColor, 20, true),
          createCell("LPH (V notch Flow)", orangeColor, 25, true),
          createCell("(Feet)", orangeColor, 25, true),
          createCell("(Feet)", orangeColor, 20, true),
        ]
      })
  ];

  data.recommendations.forEach(rec => {
      tableRows.push(new TableRow({
        children: [
          new TableCell({
            columnSpan: 5,
            shading: { fill: mapColor(rec.priorityColor) },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: rec.priorityLabel, font: headerFont, size: 20, bold: true })], alignment: "center" })]
          })
        ]
      }));

      tableRows.push(new TableRow({
        children: [
          createCell(rec.pointNo, mapColor(rec.rowColor), 10, true),
          createCell(rec.depth, mapColor(rec.rowColor), 20, true),
          createCell(rec.yieldVal, mapColor(rec.rowColor), 25, true),
          createCell(rec.layers, mapColor(rec.rowColor), 25, true),
          createCell(rec.casing, mapColor(rec.rowColor), 20, true),
        ]
      }));
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Logo removed for DOCX export as requested

          // Header info
          new Paragraph({
            children: [
                new TextRun({ text: `S.No.${data.sNo}`, font: headerFont, bold: true }),
                new TextRun({ text: `\t\t\t\t\t\t\tDate: ${data.date}`, font: headerFont, bold: true })
            ],
            spacing: { after: 200 }
          }),
           new Paragraph({
            children: [
                new TextRun({ text: "To:", font: headerFont, bold: true }),
            ],
          }),
          new Paragraph({
            children: [
                new TextRun({ text: data.toAddress, font: headerFont, bold: true }),
            ],
             spacing: { after: 400 }
          }),

          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "GEOLOGICAL INVESTIGATION REPORT",
                font: titleFont,
                size: 28,
                bold: true,
                shading: { fill: "00FFFF", type: ShadingType.CLEAR, color: "auto" }
              })
            ],
            alignment: "center",
            spacing: { after: 400 }
          }),

          // Body Paragraphs
          new Paragraph({
            children: [createUnderlineBold("Location: "), createNormalText(data.location)],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [createUnderlineBold("Physiography of the Area: "), createNormalText(data.physiography)],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [createUnderlineBold("Topographical Features of the Site: "), createNormalText(data.topographical)],
            spacing: { after: 200 }
          }),
           new Paragraph({
            children: [createUnderlineBold("Geological Condition of the Area: "), createNormalText(data.geological)],
            spacing: { after: 200 }
          }),

          // Thickness of beds list
          new Paragraph({ children: [new TextRun({ text: "Overall Expected Thickness of Beds", font: bodyFont, size })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `\ta) Over burden of the beds\t: ${data.thicknessBeds.a}`, font: bodyFont, size })] }),
          new Paragraph({ children: [new TextRun({ text: `\tb) Weathered zone\t\t: ${data.thicknessBeds.b}`, font: bodyFont, size })] }),
          new Paragraph({ children: [new TextRun({ text: `\tc) Depth of basement\t\t: ${data.thicknessBeds.c}`, font: bodyFont, size })], spacing: { after: 200 } }),

          new Paragraph({
            children: [createUnderlineBold("Hydrological condition of the Area: "), createNormalText(data.hydrological)],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [createUnderlineBold("Nature of intrusive rocks (if present): "), createNormalText(data.intrusiveRocks)],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [createUnderlineBold("Groundwater conditions of the wells: "), createNormalText(data.groundwater)],
            spacing: { after: 200 }
          }),

          // Geophysical
          new Paragraph({ children: [createUnderlineBold("Geophysical Survey Details:")], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `Type of Survey\t: ${data.geophysical.type}`, font: bodyFont, size })] }),
          new Paragraph({ children: [new TextRun({ text: `Results\t\t: ${data.geophysical.results}`, font: bodyFont, size })], spacing: { after: 800 } }),

          // Page 2 Content
          new Paragraph({
             children: [createUnderlineBold("Recommendations")],
             spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [createNormalText("Based on the interpretation of geological, hydrogeological, and geophysical data we are recommending the following :")],
            spacing: { after: 200 }
          }),

          // TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
          }),

          // Post Table Text
           new Paragraph({
            children: [createNormalText("The above report is based on modern and scientific data and criteria and is only a firm indication of high probabilities regarding the quality and quantity of the groundwater. Hence drilling of a bore well should be done at cost and consequences of the client only.")],
            spacing: { before: 200, after: 200 }
          }),

          // NOTE
          new Paragraph({
            children: [
               new TextRun({
                 text: data.note,
                 font: bodyFont,
                 size,
                 bold: true,
                 shading: { fill: yellowColor, type: ShadingType.CLEAR, color: "auto" }
               })
            ],
            spacing: { after: 400 }
          }),

          // Remarks
          new Paragraph({
            children: [createUnderlineBold("Remarks:")]
          }),
          new Paragraph({
            children: [createNormalText("To be on the safe side, cautious and to avoid any confusing situation, the clients are advised to make a note of the following facts:")],
            spacing: { after: 200 }
          }),
          
          // Dynamic Remarks List
          ...data.remarks.map(remark => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: remark, 
                  font: bodyFont, 
                  size,
                  bold: remark.includes("YOU") || remark.includes("ONE feet radius") // Basic detection for bolding key terms
                })
              ],
              bullet: { level: 0 } // This creates a proper list in Word
            })
          ),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Signature
          new Paragraph({
            children: [new TextRun({ text: "For AQUA GEO SERVICES,", font: bodyFont, bold: true })]
          }),
          ...(signatureImg ? [
              new Paragraph({
                  children: [
                      new ImageRun({
                          data: signatureImg.data,
                          transformation: { width: 150, height: 50 },
                          type: signatureImg.type,
                      }),
                  ],
              })
          ] : [
             new Paragraph({ children: [new TextRun({text: "(Signature)", size: 16, color: "000000"})] })
          ]),

          new Paragraph({
            children: [new TextRun({ text: "(D.V.S.P. Gupta)", font: bodyFont, size })],
            spacing: { before: 200 }
          }),
        ],
      },
    ],
  });
  return await Packer.toBlob(doc);
};
