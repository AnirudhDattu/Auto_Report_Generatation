
import React from 'react';
import { Logo } from './Logo';

export const Letterhead: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-[auto_1fr] gap-0 border-b-0 pb-4 mb-4 items-start">
      {/* Left side: Logo + Company Name */}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <Logo />
        </div>
        
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl font-bold text-[#0066cc] tracking-tight leading-none text-left">AQUA GEO SERVICES</h1>
          <p className="text-sm text-gray-600 mt-1 text-left font-medium">The Professional Ground Water People</p>
        </div>
      </div>

      {/* Right side: Address - positioned via grid/flex to ensure it stays right but doesn't push center */}
      <div className="justify-self-end text-right text-xs text-gray-600 leading-tight">
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
    <div className="absolute bottom-10 left-10 right-10 flex justify-between text-xs border-t border-black pt-2 font-medium">
      <span>Ground Water Survey Report – {surveyorName}</span>
      <span>Page {pageNum}</span>
    </div>
  );
};
