import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { fetchArticleBySlug, getArticleCover, getArticleCategory } from '../services/apiService';
import { Article } from '../types/Article';
import ReactMarkdown from 'react-markdown';
import AnimatedLink from '../components/ui/AnimatedLink';
import MotionDiv from '../components/ui/MotionDiv';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (!slug) return;
        const data = await fetchArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

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

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Article not found'}</p>
        </div>
        <div className="mt-6">
          <AnimatedLink 
            to="/articles" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
            variant="underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </AnimatedLink>
        </div>
      </div>
    );
  }

  const imageUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil((article.markdownContent?.length || 0) / 1000);

  return (
    <article className="pt-16 pb-24 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv delay={0.1}>
            <AnimatedLink
              to="/articles"
              className="inline-flex items-center text-gray-300 hover:text-white mb-8"
              variant="underline"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </AnimatedLink>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            {category && (
              <span className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-6">
                {category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {article.title}
            </h1>
          </MotionDiv>
            
          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>{formattedDate}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center">
                  <User size={18} className="mr-2" />
                  <span>{article.author.name}</span>
                </div>
              )}

              <div className="flex items-center">
                <Clock size={18} className="mr-2" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
      
      {/* Featured Image */}
      {article.coverMedia && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <MotionDiv delay={0.4}>
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={imageUrl} 
                alt={article.title} 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </MotionDiv>
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MotionDiv delay={0.5}>
          {article.description && (
            <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-l-4 border-blue-500">
              {article.description}
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.markdownContent && (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-12">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-10">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-8">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {article.markdownContent}
              </ReactMarkdown>
            )}
            {article.textContent && (
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.textContent}
              </div>
            )}
          </div>
          
          {/* Back Link */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <AnimatedLink 
              to="/articles" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              variant="underline"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Articles
            </AnimatedLink>
          </div>
        </MotionDiv>
      </div>
    </article>
  );
};

export default ArticleDetail;