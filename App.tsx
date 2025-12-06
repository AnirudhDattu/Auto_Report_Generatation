import React, { useState } from 'react';
import { Page1, Page2 } from './components/ReportContent';
import { Editor } from './components/Editor';
import { generatePdf } from './services/pdfService';
import { generateDocx } from './services/docxService';
import { FileDown, FileText, Loader2, PanelsTopLeft } from 'lucide-react';
import { INITIAL_DATA, ReportData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const handlePdfExport = async () => {
    setIsExporting(true);
    // Slight delay to allow UI to show loader state
    setTimeout(async () => {
      await generatePdf(data.fileName || "report");
      setIsExporting(false);
    }, 100);
  };

  const handleDocxExport = async () => {
    setIsExporting(true);
    try {
      await generateDocx(data);
    } catch (e) {
      console.error(e);
      alert("Error generating DOCX");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#111827] text-white">
      
      {/* Sidebar / Editor */}
      <div className="w-full md:w-[450px] flex-shrink-0 flex flex-col border-r border-gray-800 bg-[#0B1120]">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
             <PanelsTopLeft size={18} />
          </div>
          <div>
            <h1 className="font-bold text-base">Report Builder</h1>
            <p className="text-xs text-gray-500">Edit content & generate</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Editor data={data} onChange={setData} />
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-[#0B1120] space-y-2">
           <button
            onClick={handlePdfExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
            Download PDF
          </button>
           <button
            onClick={handleDocxExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
            Download DOCX
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-gray-900 overflow-y-auto p-8 flex flex-col items-center">
         <div className="w-full max-w-[1000px] flex flex-col gap-8 items-center">
            {/* Scale wrapper to fit A4 on screens. This scale does NOT affect PDF generation now. */}
            <div className="origin-top transform scale-[0.6] sm:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 flex flex-col gap-8">
               <div className="shadow-2xl ring-1 ring-white/10">
                 <Page1 data={data} />
               </div>
               <div className="shadow-2xl ring-1 ring-white/10">
                 <Page2 data={data} />
               </div>
            </div>
            
            <div className="text-gray-500 text-sm pb-8">
               Preview Mode • A4 Layout (210mm x 297mm) • Customizable Fonts
            </div>
         </div>
      </div>
      
    </div>
  );
};

export default App;