import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ZoomIn } from 'lucide-react';
import { Album } from '../types/albums';
import { getAlbums } from '../services/apiService';
import { useGalleryStore } from '../store/galleryStore';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';
import AnimatedButton from '../components/ui/AnimatedButton';

const AlbumPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedImage, setSelectedImage } = useGalleryStore();

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        console.error('Failed to load albums:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  const getImageUrl = (url: string) => {
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {selectedAlbum ? selectedAlbum.title : 'Albums'}
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {selectedAlbum 
                ? `${selectedAlbum.photos.length} ${selectedAlbum.photos.length === 1 ? 'photo' : 'photos'} in this collection`
                : 'Explore our curated collections of images and projects'
              }
            </p>
          </MotionDiv>
          
          {selectedAlbum && (
            <MotionDiv delay={0.3}>
              <div className="mt-8">
                <AnimatedButton
                  onClick={() => setSelectedAlbum(null)}
                  variant="secondary"
                  className="inline-flex items-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Albums
                </AnimatedButton>
              </div>
            </MotionDiv>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!selectedAlbum ? (
          // Album Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="relative pb-[66.67%] overflow-hidden">
                  <HoverImage
                    src={getImageUrl(album.cover.url) || ''}
                    alt={album.title}
                    className="absolute inset-0 w-full h-full"
                  >
                    <motion.div
                      className="bg-black/50 backdrop-blur-sm rounded-full p-3"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ZoomIn size={24} className="text-white" />
                    </motion.div>
                  </HoverImage>
                </div>
                
                <motion.div
                  className="p-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {album.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Photo Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedAlbum.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedImage(photo)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative pb-[75%]">
                  <HoverImage
                    src={getImageUrl(photo.formats.medium?.url || photo.url)}
                    alt={photo.name}
                    className="absolute inset-0 w-full h-full"
                  >
                    <motion.div
                      className="bg-black/50 backdrop-blur-sm rounded-full p-3"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ZoomIn size={24} className="text-white" />
                    </motion.div>
                  </HoverImage>
                </div>
                
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white font-medium truncate">{photo.name}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-7xl max-h-[90vh] mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <img
                src={getImageUrl(selectedImage.formats.large?.url || selectedImage.url)}
                alt={selectedImage.name}
                className="max-w-full max-h-[80vh] object-contain mx-auto rounded-2xl"
              />

              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold">{selectedImage.name}</h3>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumPage;