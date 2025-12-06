
export interface RecommendationRow {
  id: string;
  priorityLabel: string; // e.g. "1st priority point"
  priorityColor: string; // e.g. "bg-green-600"
  pointNo: string;
  depth: string;
  yieldVal: string;
  layers: string;
  casing: string;
  rowColor: string; // e.g. "bg-green-600"
}

export interface FontConfig {
  global: string;
  title: string;
  headers: string;
  body: string;
}

export interface ReportData {
  // Meta
  fileName: string;
  surveyorName: string;
  logoImage: string; // Path (static)
  signatureImage: string; // Path (static)
  
  // Style
  fonts: FontConfig;

  // Content
  sNo: string;
  date: string;
  toAddress: string;
  location: string;
  physiography: string;
  topographical: string;
  geological: string;
  thicknessBeds: {
    a: string;
    b: string;
    c: string;
  };
  hydrological: string;
  intrusiveRocks: string;
  groundwater: string;
  geophysical: {
    type: string;
    results: string;
  };
  recommendations: RecommendationRow[];
  note: string;
  remarks: string[]; // List of strings for bullet points
}

export const INITIAL_DATA: ReportData = {
  fileName: "Ground_Water_Survey_Report",
  surveyorName: "GANESH RAJ",
  // Default paths - using relative paths to ensure they load from the same directory
  logoImage: "./logo.png", 
  signatureImage: "./signature.png",

  fonts: {
    global: "Arial",
    title: "Arial",
    headers: "Arial",
    body: "Arial"
  },

  sNo: "172",
  date: "09–Apr–2024",
  toAddress: "Hyderabad",
  location: "The Investigated project is an residential building bearing H.No. 10 – 140/2 located in P.V.N. Colony, Malkajgiri, Hyderabad, Telangana Satate.",
  physiography: "There is no river course present near the above-said investigated land. However, some first-order drainage patterns were observed.",
  topographical: "The investigated land got different topographical Observations mostly ridge portions, upland areas, and sloping land surface places.",
  geological: "The formation present in the land is the ARCHEAN group of rocks. The lithology of the area is mostly fractured and semi-fractured granite. Most of the area is covered with granitic sheet rock.",
  thicknessBeds: {
    a: "01 – 03 Mts.",
    b: "03 – 06 Mts.",
    c: "06 – 09 Mts. and above"
  },
  hydrological: "Hydrological conditions of the above-said land are moderately favorable in some parts of the land and Favorable in some other parts.",
  intrusiveRocks: "No Dolerite Intrusive rocks presence was observed in and around the above said investigated land.",
  groundwater: "Bore wells / open wells present in and around the site are yielding SATISFACTORILY",
  geophysical: {
    type: "VLF & Self Potential Test",
    results: "Moderately Favorable Results Obtained"
  },
  recommendations: [
    {
      id: "1",
      priorityLabel: "1st priority point",
      priorityColor: "bg-green-600",
      pointNo: "01",
      depth: "990",
      yieldVal: "1500 – 2500 (1” to 1½”)",
      layers: "630 – 680 (dry)\n900 – 950",
      casing: "40 – 60",
      rowColor: "bg-green-600"
    },
    {
      id: "2",
      priorityLabel: "2nd priority point",
      priorityColor: "bg-cyan-400",
      pointNo: "02",
      depth: "990",
      yieldVal: "1200 – 1500 (1”)",
      layers: "900 – 950",
      casing: "50 – 60",
      rowColor: "bg-cyan-400"
    }
  ],
  note: "NOTE : The above area is a complex sheet rock area. The is in a very high-risk zone as per groundwater availability. Hence the success rate would be around 80% to 90% probability only. Clients are advised to think twice before drilling.",
  remarks: [
    "At the end of the survey all the POINTS are well marked, numbered, and informed YOU for better identification.",
    "If required for any practical reasons, the drilling can be done within a ONE feet radius from the marked points."
  ]
};
