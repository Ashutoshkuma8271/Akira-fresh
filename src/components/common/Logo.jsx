import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'normal', showTagline = true, variant = 'default', className = '' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Exact Green Squircle Leaf Emblem Matching Uploaded Logo */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`relative rounded-[16px] sm:rounded-[18px] bg-gradient-to-br from-[#1E5638] via-[#16432B] to-[#0E2F1E] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 ${
            isLarge
              ? 'w-12 h-12 sm:w-14 sm:h-14 p-2.5'
              : isSmall
              ? 'w-8 h-8 sm:w-9 sm:h-9 p-1.5'
              : 'w-10 h-10 sm:w-11 sm:h-11 p-2'
          }`}
        >
          <svg
            viewBox="0 0 36 36"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White tilted organic leaf */}
            <path
              d="M10 26C8.5 18 13.5 8 26 7C26 19.5 19.5 27.5 10 26Z"
              fill="#FFFFFF"
            />
            {/* Dark green leaf center stem */}
            <path
              d="M11 25C15 21 19 15 25 8"
              stroke="#16432B"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Delicate side branch 1 */}
            <path
              d="M15 19.5C18 18.5 20.5 19.5 22 21"
              stroke="#16432B"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Delicate side branch 2 */}
            <path
              d="M18.5 15C21 14 23 15 24 16"
              stroke="#16432B"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark & Subtitle matching image */}
      <div className="flex flex-col text-left justify-center">
        <span className="font-serif text-[22px] sm:text-[25px] font-black tracking-[-0.02em] text-[#0D1F18] dark:text-white leading-[1.05] group-hover:text-[#1E5638] dark:group-hover:text-[#84CC16] transition-colors">
          FreshNest
        </span>
        {showTagline && (
          <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.18em] text-[#4B5563] dark:text-gray-300 uppercase mt-0.5 font-sans leading-none">
            GOOD FOOD. BETTER LIVING.
          </span>
        )}
      </div>
    </Link>
  );
};
