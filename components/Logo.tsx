import React from "react";

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-24 h-24 relative">
      <img
        src="images/logo.png"
        alt="AGS Logo"
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      />
    </div>
  );
};
