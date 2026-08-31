import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  yOffset = 16,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
