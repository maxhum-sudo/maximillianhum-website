# Personal Website

A modern personal website built with Next.js, TypeScript, and Tailwind CSS. Showcase your projects, blog posts, and photos.

## Features

- **Projects Showcase**: Display your projects with descriptions, links, and images
- **Blog System**: Write blog posts in Markdown format
- **Photo Gallery**: Showcase your photos with a responsive gallery and lightbox
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Automatic dark mode support

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Content Management

### Adding Projects

Edit `content/projects.json` to add your projects:

```json
{
  "name": "Project Name",
  "description": "Project description",
  "link": "https://project-url.com",
  "image": "/projects/project-image.jpg",
  "tags": ["React", "TypeScript"]
}
```

**Note:** Project screenshots should be placed in `public/projects/` directory. These images will NOT appear in the photo gallery.

### Adding Blog Posts

Create new Markdown files in `content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
tags: ["tag1", "tag2"]
description: "A brief description"
---

Your blog post content here...
```

### Adding Photos

Place your gallery photos in `public/images/` directory. Supported formats: JPG, PNG, GIF, WebP, SVG.

**Important:** 
- Gallery photos go in `public/images/` - these appear in the Photos section
- Project screenshots go in `public/projects/` - these only appear on project cards

**Adding Country Information:**

To display the country where a photo was taken (shown on hover), edit `content/photos.json`:

```json
{
  "photoMetadata": {
    "your-photo.jpg": {
      "country": "Canada"
    },
    "another-photo.png": {
      "country": "Japan"
    }
  }
}
```

The country name will appear when you hover over the photo in the gallery, and also in the lightbox view.

## Customization

- Update your name in `components/Navigation.tsx` and `app/page.tsx`
- Modify colors and styling in `tailwind.config.ts` and `app/globals.css`
- Update metadata in `app/layout.tsx`

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Markdown parsing with `gray-matter` and `remark`

