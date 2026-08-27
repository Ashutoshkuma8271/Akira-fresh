import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'normal', showTagline = true, variant = 'default', className = '' }) => {
  const isHeader = variant === 'header';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Organic Green Leaf Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className={`relative rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#2d5f38] to-[#15803d] p-2 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 ${
          size === 'large' ? 'w-12 h-12 sm:w-14 sm:h-14' : size === 'small' ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10 sm:w-11 sm:h-11'
        }`}>
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Organic leaf */}
            <path
              d="M7 25C5 17 11 6 25 5C25 19 17 27 7 25Z"
              fill="#FFFFFF"
              className="group-hover:rotate-2 origin-bottom-left transition-transform duration-300"
            />
            {/* Delicate leaf spine */}
            <path
              d="M8 24C12 20 17 14 24 6"
              stroke="#2d5f38"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M13 19C16 18 19 19 21 21"
              stroke="#2d5f38"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M16 14C19 13 22 14 23 15"
              stroke="#2d5f38"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center leading-none">
          <span className="font-serif text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#111827] dark:text-white group-hover:text-[#1b4332] dark:group-hover:text-[#84CC16] transition-colors">
            FreshNest
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#4b5563] dark:text-[#a3b899] uppercase mt-0.5 font-sans">
            GOOD FOOD. BETTER LIVING.
          </span>
        )}
      </div>
    </Link>
  );
};



