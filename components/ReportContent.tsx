
import React from 'react';
import { ReportData } from '../types';
import { Letterhead, Footer } from './Letterhead';
import { Signature } from './Signature';

interface PageProps {
  data: ReportData;
}

export const Page1: React.FC<PageProps> = ({ data }) => {
  const titleStyle = { fontFamily: data.fonts.title };
  const headerStyle = { fontFamily: data.fonts.headers };
  const bodyStyle = { fontFamily: data.fonts.body };

  return (
    <div id="report-page-1" className="print-page relative text-sm leading-relaxed text-black" style={bodyStyle}>
      <Letterhead />

      <div className="flex justify-between font-bold mb-8 mt-6" style={headerStyle}>
        <span>S.No.{data.sNo}</span>
        <span>Date: {data.date}</span>
      </div>

      <div className="mb-6 font-bold" style={headerStyle}>
        <p>To:</p>
        <p className="whitespace-pre-line">{data.toAddress}</p>
      </div>

      <div className="flex justify-center mb-8">
        <h2 
           className="bg-cyan-400 font-bold text-lg px-2 py-0.5 border-b-2 border-cyan-500 inline-block uppercase text-black"
           style={titleStyle}
        >
          GEOLOGICAL INVESTIGATION REPORT
        </h2>
      </div>

      <div className="space-y-4 text-justify">
        <p>
          <span className="underline font-bold" style={headerStyle}>Location:</span> {data.location}
        </p>

        <p>
          <span className="underline font-bold" style={headerStyle}>Physiography of the Area:</span> {data.physiography}
        </p>

        <p>
          <span className="underline font-bold" style={headerStyle}>Topographical Features of the Site:</span> {data.topographical}
        </p>

        <p>
          <span className="underline font-bold" style={headerStyle}>Geological Condition of the Area:</span> {data.geological}
        </p>

        <div>
          <p className="mb-2" style={headerStyle}>Overall Expected Thickness of Beds</p>
          <div className="ml-24">
            <div className="grid grid-cols-[auto_1fr] gap-x-4">
              <span>a) Over burden of the beds</span>
              <span>: {data.thicknessBeds.a}</span>
              <span>b) Weathered zone</span>
              <span>: {data.thicknessBeds.b}</span>
              <span>c) Depth of basement</span>
              <span>: {data.thicknessBeds.c}</span>
            </div>
          </div>
        </div>

        <p>
          <span className="underline font-bold" style={headerStyle}>Hydrological condition of the Area:</span> {data.hydrological}
        </p>

        <p>
          <span className="underline font-bold" style={headerStyle}>Nature of intrusive rocks (if present):</span> {data.intrusiveRocks}
        </p>

        <p>
          <span className="underline font-bold" style={headerStyle}>Groundwater conditions of the wells:</span> {data.groundwater}
        </p>

        <div>
          <span className="underline font-bold block mb-2" style={headerStyle}>Geophysical Survey Details:</span>
          <div className="grid grid-cols-[150px_auto_1fr] gap-x-2">
            <span>Type of Survey</span>
            <span>:</span>
            <span>{data.geophysical.type}</span>
            <span>Results</span>
            <span>:</span>
            <span>{data.geophysical.results}</span>
          </div>
        </div>
      </div>

      <Footer pageNum={1} surveyorName={data.surveyorName} />
    </div>
  );
};

export const Page2: React.FC<PageProps> = ({ data }) => {
  const headerStyle = { fontFamily: data.fonts.headers };
  const bodyStyle = { fontFamily: data.fonts.body };

  return (
    <div id="report-page-2" className="print-page relative text-sm leading-relaxed text-black" style={bodyStyle}>
      <Letterhead />

      <h3 className="underline font-bold text-lg mb-4" style={headerStyle}>Recommendations</h3>
      
      <p className="mb-6">
        Based on the interpretation of geological, hydrogeological, and geophysical
        data we are recommending the following :
      </p>

      {/* Table */}
      <div className="border-2 border-black mb-6">
        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] text-center font-bold text-xs border-b border-black" style={headerStyle}>
          <div className="bg-orange-400 p-2 flex items-center justify-center border-r border-black">Point<br/>No</div>
          <div className="bg-orange-400 p-2 flex items-center justify-center border-r border-black">Depth<br/>Recommended</div>
          <div className="bg-orange-400 p-2 flex items-center justify-center border-r border-black">Expected<br/>Yield</div>
          <div className="bg-orange-400 p-2 flex items-center justify-center border-r border-black">Expected<br/>Layers</div>
          <div className="bg-orange-400 p-2 flex items-center justify-center">Recommended<br/>PVC Casing</div>
        </div>
        
        {/* Units Row */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] text-center font-bold text-xs border-b border-black bg-orange-400" style={headerStyle}>
          <div className="p-1 border-r border-black">Code</div>
          <div className="p-1 border-r border-black">(Feet)</div>
          <div className="p-1 border-r border-black">LPH (V notch Flow)</div>
          <div className="p-1 border-r border-black">(Feet)</div>
          <div className="p-1">(Feet)</div>
        </div>

        {/* Dynamic Rows */}
        {data.recommendations.map((row, index) => (
          <React.Fragment key={row.id || index}>
            {/* Priority Header */}
            <div className={`${row.priorityColor} text-center font-bold border-b border-black py-1`} style={headerStyle}>
              <span dangerouslySetInnerHTML={{__html: row.priorityLabel.replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>')}}></span>
            </div>

            {/* Priority Data */}
            <div className={`grid grid-cols-[60px_1fr_1fr_1fr_1fr] text-center text-xs font-bold ${index !== data.recommendations.length - 1 ? 'border-b border-black' : ''} ${row.rowColor}`} style={bodyStyle}>
              <div className="p-2 border-r border-black flex items-center justify-center">{row.pointNo}</div>
              <div className="p-2 border-r border-black flex items-center justify-center">{row.depth}</div>
              <div className="p-2 border-r border-black flex items-center justify-center">{row.yieldVal}</div>
              <div className="p-2 border-r border-black flex items-center justify-center whitespace-pre-line">{row.layers}</div>
              <div className="p-2 flex items-center justify-center">{row.casing}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <p className="text-justify mb-4">
        The above report is based on modern and scientific data and criteria and is only a firm
        indication of high probabilities regarding the quality and quantity of the groundwater.
        Hence drilling of a bore well should be done at cost and consequences of the client only.
      </p>

      <div className="bg-yellow-300 p-1 mb-6 font-bold text-justify border border-transparent whitespace-pre-wrap" style={bodyStyle}>
        {data.note}
      </div>

      <div className="mb-10">
        <p className="underline mb-2 font-bold" style={headerStyle}>Remarks:</p>
        <p className="mb-2">
          To be on the safe side, cautious and to avoid any confusing situation, the clients are advised
          to make a note of the following facts:
        </p>
        <ol className="list-decimal ml-10 space-y-4">
          {data.remarks.map((rem, idx) => (
             <li key={idx}>
               <span dangerouslySetInnerHTML={{ __html: rem.replace(/(YOU)/g, '<b>$1</b>').replace(/(ONE feet radius)/g, '<b>$1</b>') }} />
             </li>
          ))}
        </ol>
      </div>

      <div className="mb-8">
        <p className="font-bold mb-8">For AQUA GEO SERVICES,</p>
        <div className="relative h-12 w-48 mb-2">
             <Signature />
        </div>
        <p>(D.V.S.P. Gupta)</p>
      </div>

      <Footer pageNum={2} surveyorName={data.surveyorName} />
    </div>
  );
};
