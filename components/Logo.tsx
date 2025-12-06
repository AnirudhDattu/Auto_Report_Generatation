import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-20 border-2 border-blue-900 rounded-full relative bg-white">
      <div className="absolute inset-1 border border-blue-900 rounded-full flex items-center justify-center">
        <div className="flex flex-col items-center leading-none">
          <span className="text-[10px] font-bold text-blue-900 absolute top-2 left-1/2 -translate-x-1/2">GEO SERV</span>
          <span className="text-2xl font-black text-blue-900 z-10">AGS</span>
          <span className="text-[10px] font-bold text-blue-900 absolute bottom-2 left-1/2 -translate-x-1/2">HYD</span>
        </div>
      </div>
      {/* Decorative texts mimicking the circular path roughly */}
      <div className="absolute left-1 top-8 text-[8px] text-blue-900 font-bold -rotate-90">AQUA</div>
      <div className="absolute right-1 top-8 text-[8px] text-blue-900 font-bold rotate-90">ICES</div>
    </div>
  );
};