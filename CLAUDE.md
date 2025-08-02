# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Core Commands

- `npm run dev` - Start development server (http://localhost:4321)
- `npm run build` - Build production site
- `npm run preview` - Preview built site locally
- `npm run sync` - Sync content from backend system (./sync.js)

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Check Prettier formatting
- `npm run format:fix` - Fix formatting with Prettier
- `npm run stylelint` - Check CSS with Stylelint
- `npm run stylelint:fix` - Fix CSS issues automatically
- `npm run check` - Run Astro type checking
- `npm run knip` - Check for unused dependencies/exports

### Testing

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:update` - Update test snapshots
- `npm run test:coverage` - Run tests with coverage report

### Spelling Check

- `npm run lint:spelling` - Check spelling
- `npm run lint:spelling:fix` - Update project word list

## Architecture Overview

This is Frank's Movie Log, a static site built with Astro that displays movie reviews, viewing stats, and collections. The site uses a unique content management approach where content is synced from a backend system into the `/content` directory.

### Key Architecture Decisions

**Content/Code Separation**: Content lives in `/content`, completely separate from source code. This includes reviews (markdown), data (JSON), and assets (images).

**API Layer**: The `/src/api` directory provides a TypeScript API to access content, replacing Gatsby's GraphQL layer. All data is validated using Zod schemas in `/src/api/data`.

**Static-First Approach**: Pages are truly static HTML with no JavaScript for most content pages (reviews, home). Interactive pages (review lists, viewing lists) use React components.

**Asset Pipeline**: Astro handles image optimization and asset management. The build process includes:

- Pagefind for search functionality
- Sitemap generation
- HTML/CSS compression

### Content Structure

**Reviews**: Markdown files in `/content/reviews/` with frontmatter metadata. Processed through remark/rehype pipeline with custom transformations.

**Data Files**: JSON files in `/content/data/` containing:

- `reviewed-titles.json` - All reviewed movies
- `viewings.json` - Viewing history
- `watchlist-titles.json` - Watchlist items
- Stats files for overrated/underrated/underseen movies

**Assets**: Images used for the content displayed in this application. Unlike the files in `/content/reviews/` and `/content/data/` these are not synced from a backend system, but are managed as part of this application. Types include:

- `/content/assets/backdrops/` - Movie backdrop images
- `/content/assets/posters/` - Movie poster images
- `/content/assets/stills/` - Movie stills
- `/content/assets/avatars/` - Cast/crew avatars

### Component Architecture

**Page Components**: Located in `/src/components/`, each major page has its own directory with:

- Main component (e.g., `Reviews.tsx`)
- Reducer for state management (`.reducer.ts`)
- Filter components
- Props getter (`getProps.ts`)
- Tests and snapshots

**Shared Components**: Reusable UI components like `Grade.tsx`, `Poster.tsx`, `ListItem.tsx`

**Layouts**: Astro layouts in `/src/layouts/` handle page structure and Tailwind CSS

### Design System

The site uses Tailwind CSS for its styling with limited customizations defined in `/src/layouts/tailwind.css`

### Testing Strategy

- Vitest for unit/integration tests
- Testing Library for React component tests
- Snapshot tests for components and full pages
- Tests located alongside components in `__snapshots__` directories

### Deployment

GitHub Actions builds and deploys to Netlify on push to main branch. The build process:

1. Builds static site with Astro
2. Generates search index with Pagefind
3. Compresses assets
4. Deploys to Netlify

### Node/NPM Requirements

Requires Node 22.17.1 and npm 11.5.2 (specified in `.nvmrc` and package.json engines).
