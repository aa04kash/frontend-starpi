import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { fetchGalleryImages } from '../services/apiService';
import { baseUrl } from '../constants/appConstants';
import { useUIStore } from '../store/useUIStore';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';

interface GalleryImage {
  id: number;
  name: string;
  url: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
  };
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedImage, setSelectedImage } = useUIStore();

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery images:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  const fallbackImages = [
    {
      id: 1,
      name: "Web Development",
      url: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
      formats: {}
    },
    {
      id: 2,
      name: "Robotics",
      url: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
      formats: {}
    },
    {
      id: 3,
      name: "Digital Innovation",
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      formats: {}
    },
    {
      id: 4,
      name: "Team Collaboration",
      url: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
      formats: {}
    },
    {
      id: 5,
      name: "Technology",
      url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
      formats: {}
    },
    {
      id: 6,
      name: "Innovation Hub",
      url: "https://images.pexels.com/photos/3861967/pexels-photo-3861967.jpeg",
      formats: {}
    }
  ];

  const getImageUrl = (image: GalleryImage): string => {
    if (image.formats?.medium?.url) {
      return `${baseUrl}${image.formats.medium.url}`;
    } else if (image.formats?.small?.url) {
      return `${baseUrl}${image.formats.small.url}`;
    } else if (image.url.startsWith('http')) {
      return image.url;
    } else {
      return `${baseUrl}${image.url}`;
    }
  };

  const displayImages = images.length > 0 ? images : fallbackImages;

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
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

  if (error && images.length === 0) {
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
              Gallery
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Explore our collection of images showcasing our work and team
            </p>
          </MotionDiv>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative pb-[75%]">
                <HoverImage
                  src={image.url.startsWith('http') ? image.url : getImageUrl(image)}
                  alt={image.name}
                  className="absolute inset-0 w-full h-full"
                  onClick={() => openLightbox(image)}
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
                <h3 className="text-white font-semibold text-lg">{image.name}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
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
                onClick={closeLightbox}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <img
                src={selectedImage.url.startsWith('http') ? selectedImage.url : getImageUrl(selectedImage)}
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

export default Gallery;