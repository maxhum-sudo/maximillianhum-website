/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// Check if CNAME file exists (indicates custom domain is configured)
const hasCustomDomain = fs.existsSync(path.join(__dirname, 'public', 'CNAME'));

// Only use basePath when building for GitHub Pages WITHOUT a custom domain
// Custom domains serve from root, so basePath breaks asset paths
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const shouldUseBasePath = isGitHubPages && !hasCustomDomain;

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only apply basePath for GitHub Pages subdirectory deployment (no custom domain)
  // When custom domain is configured, GitHub Pages serves from root
  ...(shouldUseBasePath && {
    basePath: '/maximillianhum-website',
    trailingSlash: true,
  }),
}

module.exports = nextConfig

