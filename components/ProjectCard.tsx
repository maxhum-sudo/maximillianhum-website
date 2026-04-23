'use client';

import Link from 'next/link';

// Get basePath from Next.js config (for static exports)
// Custom domains serve from root, so no basePath needed
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    // Custom domain serves from root - no basePath needed
    if (hostname === 'maximillianhum.com' || hostname === 'www.maximillianhum.com') {
      return '';
    }
    // Check if we're on GitHub Pages subdirectory
    if (pathname.startsWith('/maximillianhum-website')) {
      return '/maximillianhum-website';
    }
  }
  return '';
};

// Helper to get image src with basePath
const getImageSrc = (src: string) => {
  if (!src) return '';
  const basePath = getBasePath();
  // Ensure src starts with / for proper path construction
  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  if (!basePath) {
    return cleanSrc;
  }
  return `${basePath}${cleanSrc}`;
};

export interface Project {
  name: string;
  description: string;
  link: string;
  image?: string;
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      {project.image && (
        <Link
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name}`}
          className="relative w-full h-48 block"
        >
          <img
            src={getImageSrc(project.image)}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </Link>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {project.name}
          </Link>
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          {project.description}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View Project →
        </Link>
      </div>
    </div>
  );
}

