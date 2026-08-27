import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'normal', showTagline = true, className = '' }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Organic Akira Fresh Leaf Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Ambient green glow */}
        <div className="absolute inset-0 bg-leaf-500/20 rounded-2xl blur-md group-hover:bg-leaf-500/35 transition-all duration-300"></div>
        
        <div className={`relative rounded-2xl bg-gradient-to-br from-forest-800 to-forest-900 border border-leaf-500/40 p-2 flex items-center justify-center shadow-leaf-sm group-hover:scale-105 group-hover:border-leaf-400 transition-all duration-300 ${
          size === 'large' ? 'w-13 h-13' : size === 'small' ? 'w-9 h-9' : 'w-11 h-11'
        }`}>
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Primary organic leaf shape */}
            <path
              d="M8 24C6 16 12 7 24 6C24 18 16 26 8 24Z"
              fill="url(#akiraLeafGrad)"
              className="group-hover:rotate-3 origin-bottom-left transition-transform duration-300"
            />
            {/* Inner delicate leaf vein */}
            <path
              d="M9 23C13 19 17 14 23 7"
              stroke="#FBF9F4"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M13 19C16 18 18 19 20 20"
              stroke="#FBF9F4"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M16 15C18 13 21 14 22 15"
              stroke="#FBF9F4"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Little golden dewdrop */}
            <circle cx="20" cy="11" r="1.5" fill="#BEF264" />

            <defs>
              <linearGradient id="akiraLeafGrad" x1="6" y1="24" x2="24" y2="6" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#15803D" />
                <stop offset="60%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-leaf-400 transition-colors">
            Akira
          </span>
          <span className="font-sans text-xl sm:text-2xl font-light tracking-wide text-leaf-400">
            Fresh
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-leaf-400/90 uppercase mt-0.5 font-sans">
            Farm Fresh • Naturally Better
          </span>
        )}
      </div>
    </Link>
  );
};
