/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages subdirectory deployment
  basePath: '/maximillianhum-website',
  trailingSlash: true,
}

module.exports = nextConfig

