import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedButton from '../ui/AnimatedButton';
import MotionDiv from '../ui/MotionDiv';

interface StoryProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment?: 'left' | 'center' | 'right';
}

const Story: React.FC<StoryProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText,
  buttonUrl,
  alignment = 'center',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const textAlignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[80vh] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <MotionDiv
            className={`max-w-3xl flex flex-col ${textAlignmentClass[alignment]} ${
              alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''
            }`}
            delay={0.2}
          >
            {subtitle && (
              <motion.p
                className="text-blue-400 font-medium mb-4 text-lg tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}

            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {description}
            </motion.p>

            {buttonText && buttonUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  href={buttonUrl}
                  className="text-lg px-12 py-4"
                >
                  {buttonText}
                </AnimatedButton>
              </motion.div>
            )}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Story;