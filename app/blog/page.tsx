import { getAllBlogPosts } from '@/lib/markdown';
import BlogCard from '@/components/BlogCard';

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
        Blog
      </h1>
      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No blog posts yet. Add your blog posts as Markdown files in{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            content/blog/
          </code>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

