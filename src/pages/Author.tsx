import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar } from 'lucide-react';
import { fetchAuthorData, fetchArticles } from '../services/apiService';
import { Article } from '../types/Article';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';
import AnimatedLink from '../components/ui/AnimatedLink';

interface AuthorData {
  id: number;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  bio?: {
    type: string;
    children: {
      type: string;
      text: string;
    }[];
  }[];
}

const Author: React.FC = () => {
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authorData = await fetchAuthorData();
        setAuthor(authorData);

        const allArticles = await fetchArticles();
        const authorArticles = allArticles.filter(
          (article) => article.author && article.author.id === authorData.id
        );
        setArticles(authorArticles);

        document.title = `${authorData.name} | Yensi Solution`;
      } catch (error) {
        console.error('Failed to load author data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getImageUrl = (url: string) => {
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  const renderBio = () => {
    if (!author?.bio || author.bio.length === 0) {
      return <p className="text-center text-gray-600 dark:text-gray-400">This author has not provided a bio.</p>;
    }

    return author.bio.map((block, index) => {
      if (block.type === 'paragraph') {
        const text = block.children.map((child) => child.text).join('');
        return (
          <p key={index} className="text-center text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
            {text}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Author information not available.</p>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <MotionDiv delay={0.1}>
            <div className="relative w-40 h-40 mb-8 overflow-hidden rounded-full">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <HoverImage
                src={getImageUrl(author.avatar?.url ?? '')}
                alt={author.name}
                className="relative w-full h-full rounded-full border-4 border-white/20"
              />
            </div>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{author.name}</h1>
          </MotionDiv>

          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a 
                  href={`mailto:${author.email}`} 
                  className="hover:text-blue-400 transition-colors"
                >
                  {author.email}
                </a>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{articles.length} Articles Published</span>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.4}>
            <div className="max-w-2xl">{renderBio()}</div>
          </MotionDiv>
        </div>
      </header>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <MotionDiv delay={0.5}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
            Articles by {author.name}
          </h2>
        </MotionDiv>

        {articles.length === 0 ? (
          <MotionDiv delay={0.6}>
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 text-xl">
                No articles available from this author yet.
              </p>
            </div>
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="p-8">
                  <AnimatedLink
                    to={`/articles/${article.slug}`}
                    className="block"
                    variant="scale"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </AnimatedLink>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description || 'Read this article to learn more...'}
                  </p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Author;