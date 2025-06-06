import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchFooterData } from '../../services/apiService';
import { FooterData, FooterLink } from '../../types/footer';
import { getLucideIcon } from '../../utils/getLucideIcon';
import AnimatedLink from '../ui/AnimatedLink';
import MotionDiv from '../ui/MotionDiv';

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchFooterData();
      if (data) {
        setFooterData(data);
      }
    };

    loadData();
  }, []);

  if (!footerData) return null;

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <MotionDiv className="lg:col-span-2" delay={0.1}>
            <AnimatedLink
              to="/"
              className="text-2xl font-bold mb-6 block"
              variant="glow"
            >
              {footerData.text}
            </AnimatedLink>

            <div className="text-gray-400 mb-8 max-w-md space-y-3">
              {footerData.description.map((block, i) =>
                block.type === 'paragraph' ? (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {block.children.map((child, j) => (
                      <span key={j}>{child.text}</span>
                    ))}
                  </motion.p>
                ) : null
              )}
            </div>

            <div className="flex space-x-6">
              {footerData.social_links.map((social, index) => {
                const iconElement = getLucideIcon(social.platform);
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {iconElement}
                  </motion.a>
                );
              })}
            </div>
          </MotionDiv>

          {/* Footer Columns */}
          {footerData.footer_columns.map((col, colIndex) => (
            <MotionDiv key={col.id} delay={0.2 + colIndex * 0.1}>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase mb-6">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.footer_links.map((link: FooterLink, linkIndex) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    {link.url ? (
                      <AnimatedLink
                        to={link.url}
                        className="text-gray-400 hover:text-white transition-colors"
                        variant="underline"
                      >
                        {link.name}
                      </AnimatedLink>
                    ) : (
                      <span className="text-gray-500">{link.name}</span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </div>

        <motion.div
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {footerData.text}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;