import React from 'react';

export const PageTransition = ({ children, className = '' }) => {
  return (
    <div className={`animate-fadeIn transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};
