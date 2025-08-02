# CLAUDE.md - Project guidance for Claude Code

## Project Overview

This is Frank's Movie Log, a personal movie review and tracking website built with Astro, React, TypeScript, and Tailwind CSS.

## Architecture Summary

- **Framework**: Astro (static site generator)
- **Components**: React with TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Data**: JSON files in content/data/
- **Build**: Vite
- **Testing**: Vitest with React Testing Library

## Key Architectural Decision: Hybrid Static/Interactive

This site uses Astro's partial hydration strategy:

1. **Static Pages (No JavaScript)**:
   - Individual review pages (`/reviews/[slug]`)
   - Article pages (how-i-grade, etc.)
   - Home page
   - These pages are purely static HTML/CSS with no client-side JavaScript

2. **Interactive Pages (React Hydration)**:
   - List pages with filters (`/reviews`, `/watchlist`, `/viewings`, etc.)
   - Collection pages (`/collections/[slug]`)
   - Cast & Crew pages (`/cast-and-crew/[slug]`)
   - These use `client:load` directive to hydrate React components for filtering/sorting

3. **Partial Interactivity**:
   - Search functionality (uses Pagefind)
   - Navigation menu (vanilla JavaScript in navMenu.ts)
   - Both loaded only when needed

## Key Directories

- `src/pages/` - Astro page routes
- `src/components/` - React components
- `src/layouts/` - Base layouts and scripts
- `src/api/` - Data processing and API functions
- `content/` - Reviews, viewings, and data files
- `public/` - Static assets

## Important Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Check Prettier formatting
- `npm run format:fix` - Fix formatting issues
- `npm run knip` - Check for unused dependencies
- `npm run check` - Run Astro check (TypeScript)

## Coding Conventions

1. **Components**: Use functional React components with TypeScript
2. **Styles**: Use Tailwind utility classes, avoid inline styles
3. **Naming**: PascalCase for components, camelCase for functions/variables
4. **Files**: .tsx for React components, .ts for utilities, .astro for pages
5. **Imports**: Use absolute imports with ~ alias for src/

## Testing Approach

- Component tests use Vitest and React Testing Library
- Page tests use snapshot testing
- Test files follow \*.spec.tsx pattern
- Run specific tests with: `npm test <pattern>`

## Common Patterns

1. **Data Loading**: Use getProps functions to fetch data at build time
2. **State Management**: Component-level state with useReducer for complex state
3. **Filtering**: Use reducer pattern for list filtering/sorting
4. **Images**: Responsive images with Astro's Image component

## Performance Considerations

- Static generation for all pages
- Selective hydration - only interactive components load JavaScript
- Image optimization with sharp
- CSS purging with Tailwind
- Minimal JavaScript bundle for interactive pages

## Development Workflow

1. Create feature branch from main
2. Make changes with proper types
3. Run tests and linting
4. **IMPORTANT**: Before creating any PR, run:
   - `npm run format` - Must pass with no errors
   - `npm run lint` - Must pass with no errors
   - `npm run check` - Must pass with no errors
   - `npm run knip` - Must pass with no errors
5. Create PR with descriptive title
6. Ensure all CI checks pass

## Recent Updates

- Migrated to Tailwind v4
- Updated to Astro v5
- Using Vite for bundling
- React 19 with experimental compiler

## Important Notes

- **Before adding JavaScript**: Consider if the feature can be achieved with CSS only
- **When creating new pages**: Default to static unless interactivity is required
- Always check existing patterns before implementing new features
- Use semantic HTML and proper ARIA attributes
- Follow existing component structure and naming
- Test on mobile viewports
- Keep bundle size minimal

## Key Dependencies

- astro: Static site generator
- react/react-dom: UI components (selectively hydrated)
- tailwindcss: Styling
- vitest: Testing framework
- typescript: Type safety
- zod: Runtime type validation
- pagefind: Search functionality
