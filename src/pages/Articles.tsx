import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArticles, getArticleCover, getArticleCategory } from '../services/apiService';
import { Article } from '../types/Article';
import { Calendar, User, ArrowRight } from 'lucide-react';
import AnimatedLink from '../components/ui/AnimatedLink';
import HoverImage from '../components/ui/HoverImage';
import MotionDiv from '../components/ui/MotionDiv';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        
        const uniqueCategories = Array.from(new Set(
          data
            .filter(article => article.category)
            .map(article => article.category?.name)
        )) as string[];
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = activeFilter === 'all' 
    ? articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())  
    : articles.filter(article => article.category?.name === activeFilter)
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Articles & Insights
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest trends, technologies, and insights from our experts.
            </p>
          </MotionDiv>
        </div>
      </div>
      
      {/* Filters */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button 
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === 'all' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Articles
              </motion.button>
              
              {categories.map((category, index) => (
                <motion.button 
                  key={index}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === category 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </MotionDiv>
        </div>
      )}
      
      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key={activeFilter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                No articles found in this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => {
  const imageUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative h-64 overflow-hidden">
        <HoverImage
          src={imageUrl}
          alt={article.title}
          className="w-full h-full"
        >
          <motion.div
            className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {category}
          </motion.div>
        </HoverImage>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <AnimatedLink
          to={`/articles/${article.slug}`}
          className="block mb-4"
          variant="scale"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </AnimatedLink>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow">
          {article.description || 'Read this article to learn more...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          {article.author && (
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{article.author.name}</span>
            </div>
          )}
        </div>

        <motion.div
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatedLink
            to={`/articles/${article.slug}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300"
            variant="underline"
          >
            Read More
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </AnimatedLink>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Articles;