import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getLucideIcon } from '../../utils/getLucideIcon';
import { extractPlainText } from '../../utils/parseRichText';
import MotionDiv from '../ui/MotionDiv';

interface Feature {
  id: number;
  title: string;
  description: string | any[];
  icon?: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  features = [],
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!features.length) return null;

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-20">
            {title && (
              <MotionDiv delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {title}
                </h2>
              </MotionDiv>
            )}

            {subtitle && (
              <MotionDiv delay={0.2}>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              </MotionDiv>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon && (
                  <motion.div
                    className="text-blue-500 mb-6 inline-block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getLucideIcon(feature.icon)}
                  </motion.div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {typeof feature.description === 'string'
                    ? feature.description
                    : extractPlainText(feature.description)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;