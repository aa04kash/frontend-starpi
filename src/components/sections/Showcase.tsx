import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedButton from '../ui/AnimatedButton';
import HoverImage from '../ui/HoverImage';
import MotionDiv from '../ui/MotionDiv';

interface ShowcaseProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: 'left' | 'right';
}

const Showcase: React.FC<ShowcaseProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imagePosition = 'right',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image */}
          <MotionDiv
            className={`lg:col-span-7 ${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
            direction={imagePosition === 'right' ? 'right' : 'left'}
            delay={0.2}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-xl"
                animate={inView ? { scale: [0.8, 1.1, 1] } : { scale: 0.8 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <HoverImage
                src={imageUrl}
                alt={title}
                className="relative rounded-3xl shadow-2xl overflow-hidden"
              />
            </div>
          </MotionDiv>

          {/* Text Content */}
          <MotionDiv
            className={`lg:col-span-5 ${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
            direction={imagePosition === 'right' ? 'left' : 'right'}
            delay={0.4}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {description}
            </motion.p>

            {buttonText && buttonLink && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedButton variant="primary" size="lg" href={buttonLink}>
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

export default Showcase;