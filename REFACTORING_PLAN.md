# Refactoring Plan - Code Duplication Reduction

## Overview

This document outlines opportunities to reduce code duplication and minimize LOC count in the franksmovielog.com codebase. Estimated total reduction: 3,500-4,500 lines (~30-40% of component code).

## Completed Tasks ✅

### 1. Create Reviews Reducer and Filters

- **Status**: COMPLETED
- **Impact**: ~1,200 lines reduction
- **Changes Made**:
  - Created shared `Reviews.reducer.ts` for Reviews, Overrated, Underrated, and Underseen
  - Created shared `Reviews.Filters.tsx` with all common filters
  - Removed 4 duplicate reducer files
  - Removed 4 duplicate filter files
  - All components now use the shared implementation

### 2. Replace DebouncedInput with TextFilter

- **Status**: COMPLETED (PR #2231)
- **Impact**: 19 lines reduction
- **Changes Made**:
  - Created `TextFilter` component with cleaner implementation
  - Removed unused ref and useImperativeHandle code
  - Updated all 7 components to use TextFilter
  - More semantic naming

### 3. Extract getGroupLetter Utility

- **Status**: COMPLETED (PR #2232)
- **Impact**: ~40 lines reduction
- **Changes Made**:
  - Created `getGroupLetter` utility function
  - Updated 5 reducers to use the utility
  - Centralized letter extraction logic

## High Priority Tasks (Biggest Impact)

### 1. Create Generic Reducer Factory for Remaining Components

- **Status**: COMPLETED with learnings (see Task Analysis section)
- **Impact**: Attempted ~1,500-2,000 lines reduction but reverted due to type safety concerns
- **Details**: Attempted factory for Viewings, Watchlist, Collection, and Cast/Staff components
  - SHOW_MORE action (identical in remaining files)
  - SORT action (identical in remaining files)
  - FILTER_TITLE action (identical in remaining files)
  - Year range filters (identical in remaining files)
  - Standard state initialization
  - Common sorting and grouping functions
- **Outcome**: Reverted to simpler utility functions approach in `~/utils/reducerUtils.ts`

### 2. Extract Common Filter Components

- **YearRangeFilter**: Used in remaining 4+ components
- **DropdownFilter**: Used in 5+ components

### 3. Create FilteredListLayout HOC

- **Impact**: ~800-1,000 lines reduction
- **Pattern**: Encapsulate common list structure
  - useReducer setup
  - ListWithFiltersLayout structure
  - Common sorting/filtering logic

## Medium Priority Tasks

### 4. Create StandardFilters Composition

- Compose common filter sets into reusable component
- Parameters: showTitle, showReleaseYear, showReviewYear, etc.

### 5. Consolidate Sort Comparators

- Title sorting (with collator)
- Date sorting
- Grade sorting
- Sequence sorting

### 6. Standardize Type Definitions

- Create shared ListItemValue type
- Standardize Sort type definitions
- Common filter action types

### 7. Apply New Abstractions

- Refactor Viewings, Watchlist, Collection components
- Update remaining list components to use new patterns

## Low Priority Tasks

### 8. Create ListItemWithHover Component

- Extract common hover effect pattern:
  ```tsx
  className={`
    group/list-item relative transform-gpu transition-transform
    tablet-landscape:has-[a:hover]:z-hover
    tablet-landscape:has-[a:hover]:scale-105
    tablet-landscape:has-[a:hover]:shadow-all
    tablet-landscape:has-[a:hover]:drop-shadow-2xl
  `}
  ```

### 9. Standardize Backdrop Components

- Similar structure across multiple components
- Extract common backdrop pattern

### 10. Extract Constants

- SHOW_COUNT_DEFAULT = 100 (appears in 9 files)
- Other repeated constants

## Implementation Strategy

1. **Start with highest ROI**: Generic reducer factory
2. **Test thoroughly**: Each refactoring should maintain existing functionality
3. **Incremental approach**: Refactor one component type at a time
4. **Maintain backwards compatibility**: Ensure existing tests pass

## Specific Duplication Examples

### Reducer Pattern (10 files)

```typescript
export function initState({ initialSort, values }) {
  return {
    allValues: values,
    filteredValues: values,
    filters: {},
    groupedValues: groupValues(
      values.slice(0, SHOW_COUNT_DEFAULT),
      initialSort,
    ),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}
```

### List Component Pattern

```tsx
export function ComponentName({ props }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, { initialSort, values }, initState);

  return (
    <ListWithFiltersLayout
      backdrop={<Backdrop />}
      filters={<Filters dispatch={dispatch} distinctValues={...} />}
      list={<GroupedList />}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) => dispatch({ type: Actions.SORT, value: e.target.value }),
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    />
  );
}
```

## Task Analysis & Learnings

### Generic Reducer Factory Attempt (COMPLETED - Reverted)

**What we tried**:

- Created a comprehensive generic reducer factory with complex TypeScript generics
- Attempted to handle all common reducer patterns (FILTER_TITLE, SHOW_MORE, SORT, year filters)
- Used discriminated unions and advanced type inference

**What we learned**:

- **Type Safety vs Code Reduction Trade-off**: The factory required extensive use of `unknown` types and type casting, which significantly reduced type safety
- **Complex Generics Create Maintenance Burden**: The generic types became so complex that they were harder to understand than the original duplicate code
- **Custom Logic Still Required Individual Handling**: Each reducer had enough unique logic that the factory couldn't eliminate as much duplication as expected

**Better Approach - Reducer Utilities**:

- Created focused utility functions in `~/utils/reducerUtils.ts`
- Each utility handles one specific pattern (title filtering, year filtering, etc.)
- Maintains full type safety with constrained generics
- Easier to understand and maintain
- Still provides code reuse without sacrificing type safety

**Key Utilities Created**:

- `handleFilterTitle` - Common title/name filtering with regex
- `handleFilterReleaseYear` - Year range filtering for release years
- `handleFilterReviewYear` - Year range filtering for review years
- `handleShowMore` - Pagination logic
- `handleSort` - Common sorting logic
- `handleToggleReviewed` - Toggle reviewed items filter
- `buildGroupValues` - Generic grouping utility

**Current Status (Branch: claude)**:

All reducers have been updated to use the utility functions where beneficial:
- Watchlist: Uses handleShowMore, handleSort, plus inline optimized filters
- Viewings: Uses filterTools (clearFilter, updateFilter) with custom grouping logic  
- Collections: Uses FilterableState type with inline implementations
- CastAndCrew: Uses buildGroupValues and filterTools
- CastAndCrewMember: Uses buildGroupValues
- Reviews: Uses buildGroupValues

**Performance Optimizations Applied**:
- Inline filter implementations in hot paths to avoid unnecessary property checks
- Direct property access (e.g., `item.title` vs `item.title || item.name`)
- Optimized regex usage in filter handlers

**Type Safety Improvements**:  
- Updated all generic type variables to be descriptive: `TItem`, `TSortValue`, `TGroupedValues` instead of `T`, `S`, `G`
- Maintained strict TypeScript constraints throughout utility functions

## Next Phase: Schema Normalization

**Identified Issue**: 
Field naming inconsistencies are creating complexity in reducer utilities. Currently `handleFilterReleaseYear` must check both `item.year` and `item.releaseYear` and handle both string and number types.

**Proposed Solution**:
Normalize all schemas to use consistent field names and types:
- `year` → `releaseYear` (string type)
- Standardize all year-related fields across the codebase

**Impact**: 
- Simplifies reducer utilities significantly
- Removes dual property checking in hot paths
- Better semantic clarity (releaseYear vs viewingYear vs reviewYear)
- Type system becomes more precise

**Estimated Changes**:
- ~6 data schema files
- ~6 component ListItemValue types  
- ~6 reducer files
- ~10+ API functions
- Template files with year references

**Branch**: To be started in new branch off main after completing current reducer utils work.

## Progress Summary

### Completed

- ✅ Reviews reducer consolidation: ~1,200 lines saved
- ✅ Reviews filters unification: ~400 lines saved
- ✅ Removed 8 redundant files
- ✅ TextFilter component: 19 lines saved
- ✅ getGroupLetter utility: ~40 lines saved
- ✅ Reducer utilities created: Provides reusable patterns while maintaining type safety
- ✅ Generic factory attempted and analyzed: Valuable learnings about type safety vs code reduction
- **Total saved so far**: ~1,659 lines

### Remaining Potential

- **Code reduction**: 1,841-2,841 additional lines (using utility approach)
- **Maintenance improvement**: Changes need updates in only one place
- **Better testability**: Test utility functions once
- **Improved consistency**: Standardized patterns across codebase
- **Easier onboarding**: Less duplicate code to understand
- **Better Type Safety**: Utilities maintain full TypeScript benefits
