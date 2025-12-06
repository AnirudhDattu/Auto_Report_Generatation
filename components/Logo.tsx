import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-20 relative">
      <img 
        src="/logo.png" 
        alt="AGS Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};