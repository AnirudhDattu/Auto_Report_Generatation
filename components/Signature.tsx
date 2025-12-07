
import React from 'react';

export const Signature: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-start">
      <img 
        src="images/signature.png" 
        alt="Signature" 
        className="h-full w-auto object-contain"
        crossOrigin="anonymous"
      />
    </div>
  );
};
