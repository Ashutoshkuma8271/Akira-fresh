import React from 'react';

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <section
      style={{ animationDelay: `${delay}s` }}
      className={`animate-fadeIn transition-all duration-300 ${className}`}
    >
      {children}
    </section>
  );
};
