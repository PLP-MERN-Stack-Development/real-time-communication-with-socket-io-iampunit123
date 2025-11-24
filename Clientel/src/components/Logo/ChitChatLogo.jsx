import React from 'react';

const ChitChatLogo = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main chat bubble */}
      <path
        d="M20 20H80V70H50L30 80V70H20V20Z"
        fill="#3B82F6"
        stroke="#1D4ED8"
        strokeWidth="2"
      />
      
      {/* Speech lines */}
      <path
        d="M30 35H70"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M30 45H60"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M30 55H65"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Sparkle effect */}
      <path
        d="M75 25L77 30L82 30L78 33L79 38L75 35L71 38L72 33L68 30L73 30L75 25Z"
        fill="#FBBF24"
      />
    </svg>
  );
};

export const LogoText = ({ size = "text-2xl" }) => {
  return (
    <div className={`font-bold ${size} text-gray-800`}>
      <span className="text-blue-600">Chit</span>
      <span className="text-green-600">Chat</span>
    </div>
  );
};

export default ChitChatLogo;