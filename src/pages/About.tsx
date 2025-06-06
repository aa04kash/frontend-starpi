import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAboutData } from '../services/apiService';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutData();
        setAboutData(data);
      } catch (err) {
        console.error('Failed to load about data:', err);
        setError('Failed to load about content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'About content not found'}</p>
        </div>
      </div>
    );
  }

  const section = aboutData.blocks.find((b: any) => b.__component === 'about.section');
  const team = aboutData;
  const values = aboutData.blocks.find((b: any) => b.__component === 'about.values');

  return (
    <div className="pt-16 pb-24 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {aboutData.title}
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {aboutData.subtitle}
            </p>
          </MotionDiv>
        </div>
      </div>

      {section && (
        <AboutSection
          content={section.content}
          imageUrl={baseUrl + section.image?.url}
        />
      )}

      {team && (
        <TeamSection
          team={team.team.map((member: any) => ({
            name: member.name,
            role: member.role,
            bio: member.bio,
            photo: member.photo?.url
              ? baseUrl + member.photo.url
              : undefined,
          }))}
        />
      )}

      {values && <ValuesSection values={values.values} />}
    </div>
  );
};

const AboutSection = ({ content, imageUrl }: { content: any[]; imageUrl: string }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const parsedContent = content
    .map((block) =>
      block.children.map((child: any) => child.text).join(' ')
    )
    .join('\n\n');

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <MotionDiv direction="left" delay={0.2}>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{parsedContent}</ReactMarkdown>
            </div>
          </MotionDiv>
          
          <MotionDiv direction="right" delay={0.4}>
            <div className="relative">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-xl"
                animate={inView ? { scale: [0.8, 1.1, 1] } : { scale: 0.8 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <HoverImage
                src={imageUrl}
                alt="About"
                className="relative rounded-3xl shadow-2xl overflow-hidden"
              />
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

const TeamSection: React.FC<{ team: TeamMember[] }> = ({ team }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <MotionDiv delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Team
            </h2>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet the talented people behind Yensi Solutions
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="group bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                <HoverImage
                  src={member.photo || `https://i.pravatar.cc/150?img=${index + 1}`}
                  alt={member.name}
                  className="w-full h-full"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-blue-500 text-center mb-4 font-medium">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ValueItem {
  title: string;
  description: string;
}

const ValuesSection: React.FC<{ values: ValueItem[] }> = ({ values }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <MotionDiv delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Values
            </h2>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </MotionDiv>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-blue-100 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;