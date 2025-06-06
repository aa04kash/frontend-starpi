import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="relative z-10"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.3 }}
      >
        {buttonContent}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {buttonContent}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default AnimatedButton;