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

function displayName(name: string) {
  return name.replace(/^Project\s+\d+:\s*/i, '');
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const title = displayName(project.name);
  const entryLabel = project.tags?.[0] ?? 'Project';

  return (
    <Link
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="polaroid-card"
      aria-label={`Open ${title}`}
    >
      <span className="polaroid-tape" aria-hidden="true" />
      <div className="polaroid-thumb">
        {project.image ? (
          <img
            src={getImageSrc(project.image)}
            alt=""
            className="polaroid-thumb-img"
          />
        ) : (
          <div className="polaroid-thumb-fallback">
            <span>{title.slice(0, 1)}</span>
          </div>
        )}
      </div>
      <div className="polaroid-meta">
        <p className="polaroid-entry">{entryLabel}</p>
        <h3 className="polaroid-caption">{title}</h3>
        <p className="polaroid-label">{project.description}</p>
      </div>
    </Link>
  );
}
