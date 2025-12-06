
import React from 'react';

export const Letterhead: React.FC<{ logo?: string | null }> = ({ logo }) => {
  return (
    <div className="w-full flex flex-row justify-between items-start border-b-0 pb-4 mb-4">
      <div className="flex items-center gap-4 text-left">
        {/* Logo Area */}
        <div className="flex flex-col items-center justify-center w-24 h-24 relative bg-white shrink-0">
          {logo ? (
            <img 
               src={logo} 
               alt="Logo" 
               className="max-w-full max-h-full object-contain" 
               onError={(e) => {
                  e.currentTarget.style.display = 'none'; // Hide broken image icon
                  e.currentTarget.parentElement?.classList.add('border-2', 'border-dashed', 'border-gray-300'); // Add border
                  const span = document.createElement('span');
                  span.innerText = "No Logo";
                  span.className = "text-[10px] text-gray-400";
                  e.currentTarget.parentElement?.appendChild(span);
               }}
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 text-center">
              No Logo
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-start text-left">
          <h1 className="text-3xl font-bold text-[#0066cc] tracking-tight leading-none">AQUA GEO SERVICES</h1>
          <p className="text-sm text-gray-600 mt-1">The Professional Ground Water People</p>
        </div>
      </div>
      <div className="text-right text-xs text-gray-600 leading-tight shrink-0">
        <p>H.No. 12-121, P & T Colony,</p>
        <p>Dilsukhnagar, Hyderabad - 500 060.</p>
        <p>Ph. : 6513 1596, Cell : 98480 15961</p>
        <p>E-mail : aquageo.gupta@gmail.com</p>
      </div>
    </div>
  );
};

export const Footer: React.FC<{ pageNum: number; surveyorName: string }> = ({ pageNum, surveyorName }) => {
  return (
    <div className="absolute bottom-10 left-10 right-10 flex justify-between text-xs border-t border-black pt-2">
      <span>Ground Water Survey Report – {surveyorName}</span>
      <span>Page {pageNum}</span>
    </div>
  );
};
