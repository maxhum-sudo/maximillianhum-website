'use client';

import { useState } from 'react';
import Image from 'next/image';

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
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className={`object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {photo.country && (
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-10 pointer-events-none ${
                    isHovered ? 'bg-black/50' : 'bg-black/0'
                  }`}
                >
                  <span
                    className={`text-white text-xl font-semibold transition-all duration-300 transform ${
                      isHovered
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {photo.country}
                  </span>
                </div>
              )}
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
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={selectedPhoto.width || 1200}
              height={selectedPhoto.height || 800}
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

