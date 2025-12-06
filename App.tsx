import React, { useState, useEffect, useRef } from 'react';
import { Page1, Page2 } from './components/ReportContent';
import { Editor } from './components/Editor';
import { generatePdf } from './services/pdfService';
import { generateDocx } from './services/docxService';
import { FileDown, FileText, Loader2, PanelsTopLeft, Eye, Edit3, Share2 } from 'lucide-react';
import { INITIAL_DATA, ReportData } from './types';
import saveAs from "file-saver";

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const calculateScale = () => {
    if (!previewContainerRef.current) return;
    
    const containerWidth = previewContainerRef.current.clientWidth;
    // A4 width in px at 96dpi is approx 794px.
    const targetWidth = 794; 
    
    // More aggressive padding calculation to prevent cutoff
    const padding = containerWidth < 768 ? 32 : 80; 
    
    let scale = (containerWidth - padding) / targetWidth;
    // Cap scale at 1.0 for large screens, allow going smaller (0.2) for very small screens
    scale = Math.min(Math.max(scale, 0.2), 1.0);
    
    setPreviewScale(scale);
  };

  // Use ResizeObserver for robust scaling updates
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    calculateScale(); // Initial calcluation

    const observer = new ResizeObserver(() => {
      calculateScale();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [activeTab]); // Re-bind if tab changes (though ref persists usually)

  // Listen to window resize as fallback
  useEffect(() => {
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleExport = async (type: 'pdf' | 'docx') => {
    setIsExporting(true);
    try {
      let blob: Blob;
      let extension: string;
      let mimeType: string;

      if (type === 'pdf') {
         blob = await generatePdf(data.fileName || "report");
         extension = 'pdf';
         mimeType = 'application/pdf';
      } else {
         blob = await generateDocx(data);
         extension = 'docx';
         mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      const filename = `${data.fileName || 'report'}.${extension}`;
      const file = new File([blob], filename, { type: mimeType });

      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Prefer Native Share on Mobile only
      if (isMobile && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Survey Report',
          text: 'Here is the generated survey report.',
        });
      } else {
        // Force Download on Desktop
        saveAs(blob, filename);
      }
    } catch (e) {
      console.error("Export error:", e);
      alert("Error generating file. Please check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  // A4 Page height is approx 1123px.
  const PAGE_HEIGHT = 1123;
  const GAP = 40;
  const contentHeight = ((PAGE_HEIGHT * 2) + GAP) * previewScale;

  return (
    // Use h-[100dvh] for mobile browsers to account for address bars
    <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden bg-[#111827] text-white font-sans">
      
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex-shrink-0 flex border-b border-gray-800 bg-[#0B1120]">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          <Edit3 size={16} /> Editor
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {/* Editor Panel - Responsive Width */}
      <div className={`${activeTab === 'editor' ? 'flex' : 'hidden'} md:flex w-full md:w-[380px] lg:w-[450px] flex-shrink-0 flex-col border-r border-gray-800 bg-[#0B1120] h-full overflow-hidden z-20`}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
             <PanelsTopLeft size={18} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Report Builder</h1>
            <p className="text-xs text-gray-500">Aqua Geo Services</p>
          </div>
        </div>
        
        {/* Scrollable Editor Area with touch scrolling enabled */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Editor data={data} onChange={setData} />
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex flex-col gap-2 p-4 border-t border-gray-800 bg-[#0B1120] flex-shrink-0">
           <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
            Download PDF
          </button>
           <button
            onClick={() => handleExport('docx')}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
            Download DOCX
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div 
        ref={previewContainerRef}
        className={`${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 bg-gray-900 flex-col items-center relative h-full overflow-hidden z-10`}
      >
         
         {/* Scrollable Preview Area */}
         <div className="flex-1 w-full overflow-y-auto p-4 md:p-8 flex flex-col items-center min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Height wrapper matches scaled content exactly to prevent blank scroll */}
            <div 
               style={{ 
                  width: `${794 * previewScale}px`, 
                  height: `${contentHeight}px`,
                  position: 'relative',
                  flexShrink: 0,
                  // Add a small bottom margin for mobile FABs so content isn't covered
                  marginBottom: '80px' 
               }}
            >
               {/* Scaled content */}
               <div 
                  className="origin-top-left flex flex-col gap-[40px] absolute top-0 left-0"
                  style={{ transform: `scale(${previewScale})` }}
               >
                  <div className="shadow-2xl ring-1 ring-white/10 bg-white">
                    <Page1 data={data} />
                  </div>
                  <div className="shadow-2xl ring-1 ring-white/10 bg-white">
                    <Page2 data={data} />
                  </div>
               </div>
            </div>
         </div>

         {/* Mobile Floating Action Buttons */}
         <div className="md:hidden absolute bottom-6 right-6 flex flex-col gap-3 z-50">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-14 h-14 rounded-full bg-red-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Share/Download PDF"
            >
               {isExporting ? <Loader2 className="animate-spin" /> : <Share2 />}
            </button>
            <button
              onClick={() => handleExport('docx')}
              disabled={isExporting}
              className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Share/Download DOCX"
            >
               {isExporting ? <Loader2 className="animate-spin" /> : <FileDown />}
            </button>
         </div>
      </div>
      
    </div>
  );
};

export default App;