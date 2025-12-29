/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to a subdirectory (e.g., username.github.io/repo-name)
  // uncomment and set your repository name:
  // basePath: '/your-repo-name',
  // trailingSlash: true,
}

module.exports = nextConfig

