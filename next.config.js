/** @type {import('next').NextConfig} */
// Only use basePath when building for GitHub Pages (set via GITHUB_PAGES env var)
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only apply basePath for GitHub Pages deployment, not for local development
  ...(isGitHubPages && {
    basePath: '/maximillianhum-website',
    trailingSlash: true,
  }),
}

module.exports = nextConfig

