'use client';

import { useState } from 'react';

// Get basePath from Next.js config (for static exports)
// For GitHub Pages, basePath is '/maximillianhum-website'
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    // Check if we're on GitHub Pages
    if (pathname.startsWith('/maximillianhum-website')) {
      return '/maximillianhum-website';
    }
  }
  return '';
};

// Helper to get image src with basePath
const getImageSrc = (src: string) => {
  const basePath = getBasePath();
  // Remove leading slash if basePath is empty to avoid double slashes
  if (!basePath && src.startsWith('/')) {
    return src;
  }
  return `${basePath}${src}`;
};

interface Photo {
  src: string;
  alt: string;
  country?: string;
  width?: number;
  height?: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No photos yet. Add your photos to{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          public/images/
        </code>
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all"
              onClick={() => setSelectedPhoto(photo)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={getImageSrc(photo.src)}
                alt={photo.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              {/* Overlay that appears on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
                  transition: 'background-color 0.3s ease',
                  zIndex: 20,
                }}
              >
                {photo.country && (
                  <span
                    className="text-white text-xl font-bold"
                    style={{
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 0.5)',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(1rem)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                    }}
                  >
                    {photo.country}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <img
              src={getImageSrc(selectedPhoto.src)}
              alt={selectedPhoto.alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {selectedPhoto.country && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
                <span className="text-lg font-semibold">{selectedPhoto.country}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

