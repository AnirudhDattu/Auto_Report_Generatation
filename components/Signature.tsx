import React from "react";
// import LOGO from "../images/logo.png";

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
