import React from 'react';

export const DinosaurSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dinoBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7fd9a8" />
          <stop offset="100%" stopColor="#5fd38f" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="108" rx="28" ry="5" fill="rgba(0,0,0,0.1)" />
      <path d="M 30 75 Q 10 65 15 50 Q 18 58 30 80 Z" fill="url(#dinoBody)" />
      <ellipse cx="55" cy="70" rx="26" ry="22" fill="url(#dinoBody)" />
      <ellipse cx="58" cy="74" rx="14" ry="14" fill="#e8f7ef" />
      <path d="M 38 48 L 34 40 L 42 48 Z" fill="#4cc380" />
      <path d="M 48 47 L 45 37 L 53 47 Z" fill="#4cc380" />
      <path d="M 58 47 L 55 37 L 63 47 Z" fill="#4cc380" />
      <path d="M 68 48 L 65 40 L 73 48 Z" fill="#4cc380" />
      <rect x="38" y="88" width="12" height="16" rx="5" fill="url(#dinoBody)" />
      <rect x="58" y="88" width="12" height="16" rx="5" fill="url(#dinoBody)" />
      <ellipse cx="44" cy="104" rx="8" ry="4" fill="#4cc380" />
      <ellipse cx="64" cy="104" rx="8" ry="4" fill="#4cc380" />
      <rect x="75" y="60" width="14" height="10" rx="5" fill="url(#dinoBody)" />
      <g transform="translate(80, 45)">
        <rect x="-22" y="-20" width="44" height="40" rx="16" fill="url(#dinoBody)" />
        <ellipse cx="-10" cy="10" rx="5" ry="3" fill="rgba(255, 181, 181, 0.5)" />
        <ellipse cx="6" cy="10" rx="5" ry="3" fill="rgba(255, 181, 181, 0.5)" />
        <ellipse cx="-7" cy="-4" rx="7" ry="8" fill="white" />
        <ellipse cx="9" cy="-4" rx="7" ry="8" fill="white" />
        <circle cx="-5" cy="-3" r="4" fill="#2d3748" />
        <circle cx="11" cy="-3" r="4" fill="#2d3748" />
        <circle cx="-7" cy="-6" r="1.5" fill="white" />
        <circle cx="9" cy="-6" r="1.5" fill="white" />
        <circle cx="17" cy="7" r="1.2" fill="#4cc380" />
        <circle cx="17" cy="10" r="1.2" fill="#4cc380" />
        <path d="M 3 12 Q 7 18 11 12" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 3 15 L 5 17 L 9 17 L 11 15" fill="#ffb5b5" />
        <path d="M -13 -20 L -17 -28 L -9 -20 Z" fill="#4cc380" />
        <path d="M -5 -22 L -7 -30 L -1 -22 Z" fill="#4cc380" />
        <path d="M 5 -22 L 3 -30 L 9 -22 Z" fill="#4cc380" />
        <path d="M 13 -20 L 9 -28 L 17 -20 Z" fill="#4cc380" />
      </g>
    </svg>
  );
};

export default DinosaurSVG;
