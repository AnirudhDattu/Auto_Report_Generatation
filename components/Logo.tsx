import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const logo = '/images/logo.png';

export const Logo: React.FC = () => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-16 h-16 border border-dashed border-gray-400 rounded bg-gray-50 p-1">
        <ImageOff className="w-6 h-6 text-gray-400 mb-1" />
        <span className="text-[8px] text-center text-gray-500 leading-tight">Logo<br/>Missing</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-16 h-16 relative">
      <img 
        src={logo} 
        alt="AGS Logo" 
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
        onError={() => setError(true)}
      />
    </div>
  );
};