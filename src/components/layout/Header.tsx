import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { fetchHeaderData } from '../../services/apiService';
import { HeaderData } from '../../types/Header';
import { useUIStore } from '../../store/useUIStore';
import AnimatedLink from '../ui/AnimatedLink';
import DarkModeToggle from '../ui/DarkModeToggle';

const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { isMenuOpen, toggleMenu } = useUIStore();

  useEffect(() => {
    const loadHeaderData = async () => {
      const data = await fetchHeaderData();
      setHeaderData(data || { 
        title: 'Yensi', 
        menu_items: [
          { label: 'Home', slug: '/' },
          { label: 'Articles', slug: '/articles' },
          { label: 'About', slug: '/about' },
          { label: 'Gallery', slug: '/gallery' },
          { label: 'Albums', slug: '/album' }
        ] 
      });
    };

    loadHeaderData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedLink
              to="/"
              className={`text-2xl font-bold ${
                scrolled 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-white'
              }`}
              variant="glow"
            >
              {headerData?.title || 'Yensi'}
            </AnimatedLink>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerData?.menu_items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedLink
                  to={item.slug}
                  className={`text-sm font-medium ${
                    scrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                  variant="underline"
                >
                  {item.label}
                </AnimatedLink>
              </motion.div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              {headerData?.menu_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AnimatedLink
                    to={item.slug}
                    className="block py-2 text-lg font-medium text-gray-700 dark:text-gray-300"
                    variant="scale"
                  >
                    {item.label}
                  </AnimatedLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;