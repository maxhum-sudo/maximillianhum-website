import PhotoGallery from '@/components/PhotoGallery';
import fs from 'fs';
import path from 'path';

interface Photo {
  src: string;
  alt: string;
  country?: string;
  width?: number;
  height?: number;
}

function getPhotoMetadata(): Record<string, { country: string }> {
  const metadataPath = path.join(process.cwd(), 'content/photos.json');
  
  if (!fs.existsSync(metadataPath)) {
    return {};
  }

  try {
    const fileContents = fs.readFileSync(metadataPath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.photoMetadata || {};
  } catch (error) {
    console.error('Error reading photo metadata:', error);
    return {};
  }
}

function getPhotos(): Photo[] {
  const imagesDirectory = path.join(process.cwd(), 'public/images');
  const metadata = getPhotoMetadata();
  
  if (!fs.existsSync(imagesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(imagesDirectory);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  
  // Exclude project screenshots - only show photos from the images directory
  // Project screenshots should be in public/projects/ directory
  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map((file) => {
      // Try to find metadata with exact filename match first
      let photoData = metadata[file];
      
      // If not found, try case-insensitive match
      if (!photoData || !photoData.country) {
        const fileLower = file.toLowerCase();
        const matchingKey = Object.keys(metadata).find(
          (key) => key.toLowerCase() === fileLower
        );
        if (matchingKey) {
          photoData = metadata[matchingKey];
        }
      }
      
      return {
        src: `/images/${file}`,
        alt: path.parse(file).name.replace(/[-_]/g, ' '),
        country: photoData?.country || undefined,
      };
    });
}

export default function PhotosPage() {
  const photos = getPhotos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
        Photos
      </h1>
      <PhotoGallery photos={photos} />
    </div>
  );
}

