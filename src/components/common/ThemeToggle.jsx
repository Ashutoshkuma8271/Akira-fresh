import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Bright Mode (Daylight)' : 'Switch to Dark Mode (Midnight Luxury)'}
      className={`group relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 cursor-pointer select-none ${
        isDark
          ? 'bg-[#0a2317] hover:bg-[#123826] border-forest-700/80 text-amber-300 shadow-xs'
          : 'bg-gray-100/90 hover:bg-gray-200 border-gray-200 text-charcoal-700 hover:text-charcoal-950 shadow-2xs'
      } ${className}`}
    >
      {/* Animated Icon Container */}
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
        {isDark ? (
          <div className="flex items-center justify-center animate-fadeIn">
            <Sun className="w-4 h-4 text-amber-300 transition-transform duration-500 group-hover:rotate-90" />
          </div>
        ) : (
          <div className="flex items-center justify-center animate-fadeIn">
            <Moon className="w-4 h-4 text-charcoal-700 transition-transform duration-300 group-hover:-rotate-12" />
          </div>
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide ml-2">
          {isDark ? 'Dark Mode' : 'Bright Mode'}
        </span>
      )}
    </button>
  );
};

