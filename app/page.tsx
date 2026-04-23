import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/markdown';
import ProjectCard, { Project } from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import fs from 'fs';
import path from 'path';

async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'content/projects.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const projects = await getProjects();
  const blogPosts = await getAllBlogPosts();
  const featuredProjects = [...projects].reverse().slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to My Website
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          I&apos;m Maximillian Hum. This is my personal website where I share my projects, 
          blog posts, and photos.
        </p>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Recent Blog Posts
            </h2>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

