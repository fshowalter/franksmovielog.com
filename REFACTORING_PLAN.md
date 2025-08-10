# Refactoring Plan - Reduce Client Bundle Size by Extracting Non-Interactive Components

## Overview

Currently, non-interactive layout components (Backdrop, Footer, Mast) are being included in client-side JavaScript bundles because they're rendered as part of hydrated interactive components. This adds ~26KB (7.9KB gzipped) of unnecessary JavaScript to every interactive page.

## Problem

The architecture has interactive list components (AllReviews, Collections, etc.) that receive a `backdrop` prop containing JSX. This forces the entire Backdrop component tree into the client bundle, even though these components:

- Are purely presentational
- Have no interactivity
- Should only render server-side

### Current Architecture

```tsx
// Page component (hydrated with client:load)
<AllReviews
  backdrop={<Backdrop ... />}  // ❌ Forces Backdrop into client bundle
  filters={...}
  list={...}
/>
```

### Impact

- **TextFilter chunk**: 26KB contains layout/backdrop components that should be server-only
- **Every interactive page** downloads and parses this unnecessary JavaScript
- **Affects**: Reviews, Collections, CastAndCrew, Viewings, Watchlist pages

## Solution

Split the layout so non-interactive components remain server-side only, while interactive components are hydrated separately.

### New Architecture

```astro
<!-- Astro page (server-rendered) -->
<Layout>
  <Backdrop {...backdropProps} />
  <!-- ✅ Server-only -->
  <InteractiveList client:load {...listProps} />
  <!-- ✅ Client hydrated -->
</Layout>
```

## Implementation Plan

### Phase 1: Create New Layout Structure

1. **Create `ListPageLayout.astro`**
   - Server-side wrapper for list pages
   - Renders Backdrop server-side
   - Slot for interactive content

2. **Update `ListWithFiltersLayout`**
   - Remove `backdrop` prop
   - Focus only on interactive filters/list
   - Simplify to just handle the interactive portions

### Phase 2: Refactor Interactive Components

Update each interactive list component to remove backdrop rendering:

1. **AllReviews.tsx**
   - Remove backdrop prop and rendering
   - Export only interactive portions

2. **Collections.tsx**
   - Remove backdrop prop and rendering
   - Export only interactive portions

3. **CastAndCrew.tsx**
   - Remove backdrop prop and rendering
   - Export only interactive portions

4. **Viewings.tsx**
   - Remove backdrop prop and rendering
   - Export only interactive portions

5. **Watchlist.tsx**
   - Remove backdrop prop and rendering
   - Export only interactive portions

6. **Collection.tsx** (individual collection pages)
   - Remove backdrop prop and rendering
   - Export only interactive portions

7. **CastAndCrewMember.tsx** (individual member pages)
   - Remove backdrop prop and rendering
   - Export only interactive portions

### Phase 3: Update Astro Pages

Update each Astro page to use the new structure:

1. **reviews/index.astro**

   ```astro
   <Layout>
     <Backdrop {...backdropProps} />
     <AllReviews client:load {...interactiveProps} />
   </Layout>
   ```

2. **collections/index.astro**
   - Similar pattern

3. **cast-and-crew/index.astro**
   - Similar pattern

4. **viewings/index.astro**
   - Similar pattern

5. **watchlist/index.astro**
   - Similar pattern

6. **Individual pages** (collection/[slug], cast-and-crew/[slug])
   - Similar pattern

### Phase 4: Update Props and Types

1. **Update getProps functions**
   - Separate backdrop props from interactive props
   - Return structured object with clear separation

2. **Update component Props types**
   - Remove backdrop-related props from interactive components
   - Keep only data needed for interactivity

### Phase 5: Testing

1. **Update component tests**
   - Remove backdrop from test setup
   - Focus tests on interactive behavior

2. **Update snapshot tests**
   - Regenerate snapshots for new structure
   - Verify no visual regressions

## Expected Benefits

### Bundle Size Reduction

- **TextFilter chunk**: Should reduce from 26KB to ~1-2KB
- **Overall savings**: ~24KB uncompressed (~7KB gzipped) per page load
- **Affected pages**: All interactive list pages

### Performance Improvements

- Faster initial JavaScript parse/execution
- Less memory usage
- Faster hydration

### Architecture Benefits

- Clearer separation of concerns
- Server-only components stay server-only
- Easier to reason about what gets bundled

## Implementation Order

1. Start with one page as proof of concept (e.g., AllReviews)
2. Verify bundle size reduction
3. Apply pattern to remaining pages
4. Update tests
5. Clean up unused code

## Success Metrics

- TextFilter chunk reduces to <3KB
- No Backdrop/Footer/Mast code in any client bundle
- All tests pass
- No visual regressions
- Page functionality unchanged

## Risks and Mitigations

### Risk: Breaking existing functionality

**Mitigation**: Implement one page at a time, test thoroughly

### Risk: Type mismatches

**Mitigation**: Carefully update types alongside components

### Risk: Test failures

**Mitigation**: Update tests incrementally as components change

## Alternative Approaches Considered

1. **Keep current architecture, optimize components**
   - ❌ Would require significant changes to how props are passed
   - ❌ Doesn't solve root issue

2. **Use dynamic imports**
   - ❌ Backdrop is needed at render time
   - ❌ Adds complexity without solving the problem

3. **Server Components (when available in Astro)**
   - ✅ Would be ideal future solution
   - ❌ Not available yet

## Notes

- This refactoring aligns with Astro's philosophy of shipping less JavaScript
- The pattern can be applied to other pages that may have similar issues
- Consider documenting this pattern for future development
