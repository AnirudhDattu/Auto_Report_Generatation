import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun } from "docx";
import saveAs from "file-saver";
import { ReportData } from "../types";

// Helper to convert Base64 to Uint8Array for docx image support
const base64ToUint8Array = (base64String: string): Uint8Array | null => {
  try {
    const arr = base64String.split(',');
    const dataStr = arr.length > 1 ? arr[1] : arr[0];
    const binaryString = window.atob(dataStr);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Error converting base64 image", e);
    return null;
  }
};

export const generateDocx = async (data: ReportData) => {
  // Styles
  const font = "Arial";
  const size = 22; // 11pt
  
  const createBoldText = (text: string) => new TextRun({ text, font, size, bold: true });
  const createNormalText = (text: string) => new TextRun({ text, font, size });
  const createUnderlineBold = (text: string) => new TextRun({ text, font, size, bold: true, underline: { type: "single" } });

  // Convert images
  let logoBuffer: Uint8Array | null = null;
  if (data.logoImage) {
      logoBuffer = base64ToUint8Array(data.logoImage);
  }

  let signatureBuffer: Uint8Array | null = null;
  if (data.signatureImage) {
      signatureBuffer = base64ToUint8Array(data.signatureImage);
  }

  // Table Cell Helper with margins
  const createCell = (text: string, fill: string, widthPercent: number, bold: boolean = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { fill: fill, type: ShadingType.CLEAR, color: "auto" },
      margins: {
         top: 100,
         bottom: 100,
         left: 100,
         right: 100,
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text, font, size: 20, bold })], // slightly smaller than body text
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
            children: [new Paragraph({ children: [new TextRun({ text: rec.priorityLabel, font, size: 20, bold: true })], alignment: "center" })]
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
          // Logo if exists
          ...(logoBuffer ? [
              new Paragraph({
                  children: [
                      new ImageRun({
                          data: logoBuffer,
                          transformation: { width: 100, height: 100 },
                      }),
                  ],
                  spacing: { after: 200 }
              })
          ] : []),

          // Header info
          new Paragraph({
            children: [
                new TextRun({ text: `S.No.${data.sNo}`, font, bold: true }),
                new TextRun({ text: `\t\t\t\t\t\t\tDate: ${data.date}`, font, bold: true })
            ],
            spacing: { after: 200 }
          }),
           new Paragraph({
            children: [
                new TextRun({ text: "To:", font, bold: true }),
            ],
          }),
          new Paragraph({
            children: [
                new TextRun({ text: data.toAddress, font, bold: true }),
            ],
             spacing: { after: 400 }
          }),

          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "GEOLOGICAL INVESTIGATION REPORT",
                font,
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
          new Paragraph({ children: [createNormalText("Overall Expected Thickness of Beds")], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `\ta) Over burden of the beds\t: ${data.thicknessBeds.a}`, font, size })] }),
          new Paragraph({ children: [new TextRun({ text: `\tb) Weathered zone\t\t: ${data.thicknessBeds.b}`, font, size })] }),
          new Paragraph({ children: [new TextRun({ text: `\tc) Depth of basement\t\t: ${data.thicknessBeds.c}`, font, size })], spacing: { after: 200 } }),

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
          new Paragraph({ children: [new TextRun({ text: `Type of Survey\t: ${data.geophysical.type}`, font, size })] }),
          new Paragraph({ children: [new TextRun({ text: `Results\t\t: ${data.geophysical.results}`, font, size })], spacing: { after: 800 } }),

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
                 font,
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
           new Paragraph({
            text: "1) At the end of the survey all the POINTS are well marked, numbered, and informed YOU for better identification.",
            bullet: { level: 0 }
          }),
           new Paragraph({
            text: "2) If required for any practical reasons, the drilling can be done within a ONE feet radius from the marked points.",
            bullet: { level: 0 },
            spacing: { after: 600 }
          }),

          // Signature
          new Paragraph({
            children: [new TextRun({ text: "For AQUA GEO SERVICES,", font, bold: true })]
          }),
          
          ...(signatureBuffer ? [
              new Paragraph({
                  children: [
                      new ImageRun({
                          data: signatureBuffer,
                          transformation: { width: 150, height: 50 },
                      }),
                  ],
              })
          ] : [
             new Paragraph({ children: [new TextRun({text: "(Signature Placeholder)", size: 16, color: "888888"})] })
          ]),

          new Paragraph({
            children: [new TextRun({ text: "(D.V.S.P. Gupta)", font, size })],
            spacing: { before: 200 }
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.fileName || "Ground_Water_Survey_Report"}.docx`);
};