
import React, { useState, useEffect, useRef } from 'react';
import { Page1, Page2 } from './components/ReportContent';
import { Editor } from './components/Editor';
import { LandingPage } from './components/LandingPage';
import { generatePdf } from './services/pdfService';
import { generateDocx } from './services/docxService';
import { FileDown, FileText, Loader2, PanelsTopLeft, Eye, Edit3, Share2, ChevronLeft, ArrowLeft, Layout } from 'lucide-react';
import { INITIAL_DATA, ReportData } from './types';
import saveAs from "file-saver";

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [previewScale, setPreviewScale] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
  }, [activeTab, view]); // Re-bind if tab or view changes

  // Listen to window resize as fallback
  useEffect(() => {
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const validateReport = (): boolean => {
    const errors: string[] = [];
    
    // Critical fields check
    if (!data.surveyorName?.trim()) errors.push('surveyorName');
    if (!data.sNo?.trim()) errors.push('sNo');
    if (!data.date?.trim()) errors.push('date');
    if (!data.toAddress?.trim()) errors.push('toAddress');
    if (!data.location?.trim()) errors.push('location');
    
    // Check recommendations
    if (!data.recommendations || data.recommendations.length === 0) {
      errors.push('recommendations');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleExport = async (type: 'pdf' | 'docx') => {
    // Validate before export
    if (!validateReport()) {
      // If on mobile preview tab, switch to editor so user can see errors
      if (activeTab === 'preview') {
        setActiveTab('editor');
      }
      
      // Determine message based on errors
      const hasRecError = validationErrors.includes('recommendations') || (data.recommendations.length === 0);
      let msg = "Please fill in all required fields (highlighted in red) before exporting.";
      if (hasRecError) {
        msg += "\n\n• You must add at least one Recommendation.";
      }
      
      alert(msg);
      return;
    }

    setIsExporting(true);
    try {
      // 1. GENERATION PHASE
      let blob: Blob;
      let extension: string;
      let mimeType: string;

      try {
        if (type === 'pdf') {
           blob = await generatePdf(data.fileName || "report");
           extension = 'pdf';
           mimeType = 'application/pdf';
        } else {
           blob = await generateDocx(data);
           extension = 'docx';
           mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
      } catch (genError) {
        console.error("File generation failed:", genError);
        alert("Failed to generate the file. Please check input data.");
        setIsExporting(false);
        return;
      }

      const filename = `${data.fileName || 'report'}.${extension}`;
      const file = new File([blob], filename, { type: mimeType });

      // 2. SHARING / DOWNLOAD PHASE
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      let actionCompleted = false;

      if (isMobile && navigator.share) {
        try {
          const shareData = {
            files: [file],
            title: 'Survey Report',
            text: 'Here is the generated survey report.',
          };

          // Check if the browser supports sharing these specific files
          if (navigator.canShare && !navigator.canShare(shareData)) {
             console.warn("Navigator cannot share this content, falling back to download.");
          } else {
             await navigator.share(shareData);
             actionCompleted = true; // Share successful
          }
        } catch (shareError: any) {
          // If user cancelled, we consider it handled (don't force download)
          if (shareError.name === 'AbortError') {
             actionCompleted = true; 
          } else {
             console.warn("Share failed:", shareError);
             // actionCompleted remains false, will trigger download
          }
        }
      }

      // If share was not performed (unsupported, failed, or desktop), download the file
      if (!actionCompleted) {
        saveAs(blob, filename);
      }

    } catch (e) {
      console.error("Unexpected export error:", e);
      alert("An unexpected error occurred during export.");
    } finally {
      setIsExporting(false);
    }
  };

  // A4 Page height is approx 1123px.
  const PAGE_HEIGHT = 1123;
  const GAP = 40;
  const contentHeight = ((PAGE_HEIGHT * 2) + GAP) * previewScale;

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    // Use h-[100dvh] for mobile browsers to account for address bars
    <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden bg-[#111827] text-white font-sans transition-opacity duration-500 ease-in-out opacity-100">
      
      {/* Mobile Top Header (Back & Title) */}
      <div className="md:hidden flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0B1120] relative z-30">
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setView('landing')}
             className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold text-sm">Report Builder</span>
        </div>
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <PanelsTopLeft size={12} className="text-white" />
        </div>
      </div>

      {/* Editor Panel - Responsive Width */}
      <div className={`${activeTab === 'editor' ? 'flex' : 'hidden'} md:flex w-full md:w-[420px] lg:w-[480px] flex-shrink-0 flex-col border-r border-gray-800 bg-[#0B1120] h-full overflow-hidden z-20 shadow-xl relative`}>
        {/* Sidebar Header (Desktop) */}
        <div className="hidden md:flex p-4 border-b border-gray-800 items-center justify-between flex-shrink-0 bg-[#0B1120]/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('landing')}
              className="flex w-8 h-8 rounded-full items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              title="Back to Home"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/30">
                <PanelsTopLeft size={16} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-gray-100 leading-tight">Report Editor</h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Aqua Geo Services</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable Editor Area with touch scrolling enabled */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-[#0B1120] pb-20 md:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Editor data={data} onChange={setData} validationErrors={validationErrors} />
        </div>
        
        {/* Desktop Sticky Actions */}
        <div className="hidden md:flex flex-col gap-3 p-4 border-t border-gray-800 bg-[#0B1120] flex-shrink-0 z-20">
           <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-3 rounded-xl font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wide group"
              >
                {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                Export PDF
              </button>
              <button
                onClick={() => handleExport('docx')}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-3 rounded-xl font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wide group"
              >
                {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                Export Word
              </button>
           </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div 
        ref={previewContainerRef}
        className={`${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 bg-gray-950/80 flex-col items-center relative h-full overflow-hidden z-10 backdrop-blur-sm`}
      >
         {/* Background pattern for preview area */}
         <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         
         {/* Scrollable Preview Area */}
         <div className="flex-1 w-full overflow-y-auto p-4 md:p-8 flex flex-col items-center min-h-0 relative z-10 pb-32 md:pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Height wrapper matches scaled content exactly to prevent blank scroll */}
            <div 
               style={{ 
                  width: `${794 * previewScale}px`, 
                  height: `${contentHeight}px`,
                  position: 'relative',
                  flexShrink: 0,
               }}
            >
               {/* Scaled content */}
               <div 
                  className="origin-top-left flex flex-col gap-[40px] absolute top-0 left-0"
                  style={{ transform: `scale(${previewScale})` }}
               >
                  <div className="shadow-2xl ring-1 ring-black/10 bg-white transition-shadow hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                    <Page1 data={data} />
                  </div>
                  <div className="shadow-2xl ring-1 ring-black/10 bg-white transition-shadow hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                    <Page2 data={data} />
                  </div>
               </div>
            </div>
         </div>

         {/* Mobile Floating Action Buttons (Only visible in Preview) */}
         <div className={`md:hidden absolute bottom-24 right-6 flex flex-col gap-3 z-50 transition-transform duration-300 ${activeTab === 'preview' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-12 h-12 rounded-full bg-red-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
              title="Share/Download PDF"
            >
               {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleExport('docx')}
              disabled={isExporting}
              className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              title="Share/Download DOCX"
            >
               {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <FileDown className="w-5 h-5" />}
            </button>
         </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <div className="md:hidden flex-shrink-0 flex items-center border-t border-gray-800 bg-[#0B1120] pb-[env(safe-area-inset-bottom)] z-40 fixed bottom-0 w-full shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-4 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors relative ${activeTab === 'editor' ? 'text-blue-400' : 'text-gray-500'}`}
        >
          <Edit3 size={20} /> 
          <span>Editor</span>
          {activeTab === 'editor' && <div className="absolute top-0 w-12 h-0.5 bg-blue-500 rounded-b-full" />}
        </button>
        
        {/* Center Divider */}
        <div className="w-px h-8 bg-gray-800"></div>

        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-4 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors relative ${activeTab === 'preview' ? 'text-blue-400' : 'text-gray-500'}`}
        >
          <Eye size={20} /> 
          <span>Preview</span>
          {activeTab === 'preview' && <div className="absolute top-0 w-12 h-0.5 bg-blue-500 rounded-b-full" />}
        </button>
      </div>
      
    </div>
  );
};

export default App;
