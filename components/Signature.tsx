import React, { useState } from 'react';

const signature = '/images/signature.png';

export const Signature: React.FC = () => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50 rounded">
        <span className="text-xs text-gray-400 italic">Signature Not Found</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-start">
      <img 
        src={signature} 
        alt="Signature" 
        className="h-full w-auto object-contain"
        crossOrigin="anonymous"
        onError={() => setError(true)}
      />
    </div>
  );
};