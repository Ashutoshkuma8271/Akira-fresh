import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'normal', showTagline = true, variant = 'default', className = '' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const isWhiteVariant = variant === 'white' || variant === 'light';

  return (
    <Link to="/" className={`inline-flex items-center gap-2 sm:gap-2.5 group select-none ${className}`}>
      {/* Golden Cutlery & Chef Hat Emblem representing A_S FOODY */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`relative rounded-full bg-gradient-to-br from-[#0c1b14] via-[#05110c] to-[#010503] flex items-center justify-center shadow-lg border border-[#D4AF37] transition-transform duration-300 group-hover:scale-105 ${
            isLarge
              ? 'w-13 h-13 sm:w-14 sm:h-14 p-2'
              : isSmall
              ? 'w-8 h-8 sm:w-9 sm:h-9 p-1'
              : 'w-10 h-10 sm:w-11 sm:h-11 p-1.5'
          }`}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer gold ring */}
            <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            {/* Inner gold dashed ring */}
            <circle cx="50" cy="50" r="41" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3,3" fill="none" />

            {/* Chef Hat (Center Top) */}
            <path
              d="M 50,22 C 44,22 42,26 42,30 C 37,30 35,34 38,38 C 39,40 41,41 43,41 L 57,41 C 59,41 61,40 62,38 C 65,34 63,30 58,30 C 58,26 56,22 50,22 Z"
              fill="#FFFFFF"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Chef Hat Band */}
            <path
              d="M 43,41 L 57,41 L 56,46 L 44,46 Z"
              fill="#D4AF37"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
            {/* Crossed spoon and fork below hat */}
            <path
              d="M 45,43 L 55,53 M 55,43 L 45,53"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Crown Emblem (Middle) */}
            <path
              d="M 45,35 L 47,38 L 50,33 L 53,38 L 55,35 L 54,40 L 46,40 Z"
              fill="#D4AF37"
            />

            {/* Spoon (Left Side) */}
            <path
              d="M 24,32 C 22,32 20,35 20,40 C 20,45 22,48 24,48 L 25,48 L 25,68 C 25,69 26,70 27,70 C 28,70 29,69 29,68 L 29,48 L 30,48 C 32,48 34,45 34,40 C 34,35 32,32 30,32 Z"
              fill="#D4AF37"
              transform="rotate(-25, 27, 50)"
            />

            {/* Fork (Right Side) */}
            <path
              d="M 70,32 L 70,44 L 71,44 L 71,68 C 71,69 72,70 73,70 C 74,70 75,69 75,68 L 75,44 L 76,44 L 76,32 M 72,32 L 72,40 M 74,32 L 74,40"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              transform="rotate(25, 73, 50)"
            />

            {/* Red Chili Pepper (Bottom Left Accent) */}
            <path
              d="M 32,70 C 34,74 38,76 42,75 C 43,75 44,73 43,72 C 40,72 36,70 34,66 Z"
              fill="#EF4444"
            />
            <path
              d="M 32,70 C 31,69 30,68 31,67"
              stroke="#84CC16"
              strokeWidth="1"
              fill="none"
            />

            {/* Red Chili Pepper (Bottom Right Accent) */}
            <path
              d="M 68,70 C 66,74 62,76 58,75 C 57,75 56,73 57,72 C 60,72 64,70 66,66 Z"
              fill="#EF4444"
            />
            <path
              d="M 68,70 C 69,69 70,68 69,67"
              stroke="#84CC16"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark & Subtitle (Always visible and styled properly) */}
      <div className="flex flex-col text-left justify-center shrink-0">
        <span
          className={`font-serif font-black tracking-[-0.01em] leading-[1.05] transition-colors ${
            isLarge
              ? 'text-xl sm:text-2xl md:text-3xl'
              : isSmall
              ? 'text-[14px] sm:text-[16px]'
              : 'text-[15px] sm:text-[18px] md:text-[20px]'
          } ${
            isWhiteVariant
              ? 'text-white group-hover:text-[#D4AF37]'
              : 'text-[#0D1F18] dark:text-white group-hover:text-[#D4AF37] dark:group-hover:text-[#FBBF24]'
          }`}
        >
          A_S FOODY
        </span>
        {showTagline && (
          <span
            className={`font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase mt-0.5 font-sans leading-none ${
              isLarge
                ? 'text-[8px] sm:text-[9px]'
                : isSmall
                ? 'text-[6px] sm:text-[7px]'
                : 'text-[6.5px] sm:text-[7.5px]'
            } ${
              isWhiteVariant
                ? 'text-emerald-400/90'
                : 'text-[#4B5563] dark:text-emerald-400'
            }`}
          >
            FRESH • TASTY • ALWAYS
          </span>
        )}
      </div>
    </Link>
  );
};
