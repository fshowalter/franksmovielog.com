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

## Major Refactor (2025)

The codebase underwent a significant architectural refactoring to improve maintainability, reduce duplication, and better separate concerns. Key changes include:

1. **Component Architecture Overhaul**:
   - Migrated from large, monolithic components (e.g., `CastAndCrew.tsx`, `Collections.tsx`) to smaller, composable units
   - Introduced a new `filter-and-sort` component system with reusable filtering/sorting logic
   - Split components into atomic units (e.g., `list-item-*` components for different list item aspects)

2. **New Abstraction Layers**:
   - **Filterers** (`src/filterers/`): Pure functions for filtering data
   - **Sorters** (`src/sorters/`): Pure functions for sorting data
   - **Groupers** (`src/groupers/`): Pure functions for grouping data
   - **Reducers** (`src/reducers/`): State management for filters, sorts, and pagination
   - **Hooks** (`src/hooks/`): Reusable React hooks for common patterns

3. **Astro Integration**:
   - Created `src/astro/` directory for Astro-specific components and utilities
   - Introduced `AstroPageShell.astro` as a base template for all pages
   - Separated search and navigation logic into dedicated modules

4. **File Naming Convention**:
   - API files now use kebab-case (e.g., `cast-and-crew.ts` instead of `castAndCrew.ts`)
   - Maintained PascalCase for React components
   - Consistent naming patterns throughout the codebase

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
- `src/components/` - React components (now organized into feature-specific subdirectories)
- `src/astro/` - Astro-specific components and utilities
- `src/api/` - Data processing and API functions (now using kebab-case naming)
- `src/filterers/` - Pure functions for filtering data
- `src/sorters/` - Pure functions for sorting data
- `src/groupers/` - Pure functions for grouping data
- `src/reducers/` - State management reducers for filters and sorting
- `src/hooks/` - Reusable React hooks
- `src/layouts/` - Base layouts and scripts (deprecated, moved to astro/)
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

### Anchor comments

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.

#### Guidelines:

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.
- **Important:** Before scanning files, always first try to **grep for existing anchors** `AIDEV-*` in relevant subdirectories.
- **Update relevant anchors** when modifying associated code.
- **Do not remove `AIDEV-NOTE`s** without explicit human instruction.
- Make sure to add relevant anchor comments, whenever a file or piece of code is:
  - too complex, or
  - very important, or
  - confusing, or
  - could have a bug

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

1. **Data Loading**: Use getProps functions to fetch data at build time (now typically in page files directly)
2. **State Management**: Dedicated reducers in `src/reducers/` for different data types
3. **Filtering & Sorting**:
   - Use pure functions in `src/filterers/` and `src/sorters/`
   - Compose with hooks from `src/hooks/` for UI integration
   - Unified `FilterAndSortContainer` component for consistent UI
4. **Images**: Responsive images with Astro's Image component
5. **Component Composition**: Small, focused components composed together rather than monolithic components

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
2. **IMPORTANT**: Always rebase on origin/main before pushing:
   - `git pull --rebase origin main`
   - This ensures your PR is based on the latest code
3. Make changes with proper types
4. Run tests and linting
5. **IMPORTANT**: Before creating any PR, run:
   - `npm run test` - Must pass with no errors
   - `npm run lint` - Must pass with no errors
   - `npm run lint:spelling` - Must pass with no errors
   - `npm run check` - Must pass with no errors
   - `npm run knip` - Must pass with no errors
   - `npm run format` - Must pass with no errors
6. Create PR with descriptive title
7. Ensure all CI checks pass

## Recent Updates

- **Major refactor (2025)**: Complete component architecture overhaul (see above)
- Migrated to Tailwind v4
- Updated to Astro v5
- Using Vite for bundling
- React 19 with experimental compiler
- Introduced ESLint rule for type-only imports
- Reorganized test structure with better snapshot testing

## Important Notes

- **Component Organization**: Components are now organized by feature/purpose in subdirectories
- **Separation of Concerns**: Business logic (filtering, sorting, grouping) is separated from UI components
- **Pure Functions**: Prefer pure functions in `filterers/`, `sorters/`, and `groupers/` for testability
- **Before adding JavaScript**: Consider if the feature can be achieved with CSS only
- **When creating new pages**: Default to static unless interactivity is required
- Always check existing patterns before implementing new features
- Use semantic HTML and proper ARIA attributes
- Follow existing component structure and naming (subdirectories for related components)
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
- **IMPORTANT**: Always use `import type { ... }` for type-only imports to ensure proper tree-shaking. Never mix type imports with regular imports using `import { type ... }` syntax as this can prevent tree-shaking optimizations.
