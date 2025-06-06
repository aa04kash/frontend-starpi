import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';
import MotionDiv from '../ui/MotionDiv';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {subtitle && (
            <MotionDiv delay={0.2}>
              <motion.p
                className="text-blue-400 text-lg md:text-xl mb-6 font-medium tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            </MotionDiv>
          )}

          <MotionDiv delay={0.4}>
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.span>
            </motion.h1>
          </MotionDiv>

          {description && (
            <MotionDiv delay={0.6}>
              <motion.p
                className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {description}
              </motion.p>
            </MotionDiv>
          )}

          {buttonText && (
            <MotionDiv delay={0.8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedButton
                  href={buttonLink}
                  variant="primary"
                  size="lg"
                  className="text-lg px-12 py-4"
                >
                  {buttonText}
                </AnimatedButton>
              </motion.div>
            </MotionDiv>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center text-white cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-sm mb-2 tracking-wide">Scroll</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;