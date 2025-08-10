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
- **Browser Support**: Same as Tailwind https://tailwindcss.com/docs/compatibility

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
- `npm run build` - Build for production (⚠️ TAKES HOURS - generates 1,800+ static pages)
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
- **IMPORTANT**: Only run one vitest instance at a time (each uses ~2GB RAM)
  - Use `npx vitest --max-workers=2 --run path/to/spec.tsx` for single test files
  - Avoid running multiple test commands in parallel
- **Test Runner Best Practices**:
  - Always run vitest (or npm test) with max-workers=2 to prevent spawning a bunch of threads
  - Never have more than one instance of vitest running (always wait for the last run to end before running again)

## Testing Principles

- The purpose of tests is to tell me two things:
  1. Will this dependency update break the site?
  2. Will this change cause other, unintended changes?
- Rely on snapshot tests as all websites boil down to text output
- Two primary testing strategies:
  - **Pure Static Pages**:
    - Simple snapshot tests at both Astro page level and page component level
    - Astro level checks Astro code
    - Page-component level checks prop permutations
  - **Interactive Pages**:
    - Snapshots at Astro level
    - Snapshot tests at page component level using testing library
    - Exercise interactive elements like a user
  - Goal: By exercising all options and rendering all permutations, any uncovered code must be dead code safe to remove

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

1. **IMPORTANT**: Always create a new feature branch for new features:
   - `git checkout -b feat/feature-name` for features
   - `git checkout -b fix/bug-name` for bug fixes
   - `git checkout -b chore/task-name` for maintenance tasks
2. Make changes with proper types
3. Run tests and linting
4. **IMPORTANT**: Before creating any PR, run:
   - `npm run test` - Must pass with no errors
   - `npm run lint` - Must pass with no errors
   - `npm run lint:spelling` - Must pass with no errors
   - `npm run check` - Must pass with no errors
   - `npm run knip` - Must pass with no errors
   - `npm run format` - Must pass with no errors
5. **IMPORTANT**: Always rebase on origin/main before pushing:
   - `git pull --rebase origin main`
   - This ensures your PR is based on the latest code
6. Create PR with descriptive title
7. Ensure all CI checks pass

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
- Avoid casts unless absolutely necessary

## Key Dependencies

- astro: Static site generator
- react/react-dom: UI components (selectively hydrated)
- tailwindcss: Styling
- vitest: Testing framework
- typescript: Type safety
- zod: Runtime type validation
- pagefind: Search functionality

## Test Runner Notes

- When running test or test:coverage, make sure and run with max-workers=2

## TypeScript Best Practices

- Don't use the `any` type. The linter will error on it.
