import React from 'react';
import { motion } from 'framer-motion';

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const HoverImage: React.FC<HoverImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  onClick,
  children 
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.div
        className="absolute inset-0 bg-black/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {children && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HoverImage;