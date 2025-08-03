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

## High Priority Tasks (Biggest Impact)

### 1. Create Generic Reducer Factory for Remaining Components

- **Impact**: ~1,500-2,000 lines reduction
- **Details**: Create factory for Viewings, Watchlist, Collection, and Cast/Staff components
  - SHOW_MORE action (identical in remaining files)
  - SORT action (identical in remaining files)
  - FILTER_TITLE action (identical in remaining files)
  - Year range filters (identical in remaining files)
  - Standard state initialization
  - Common sorting and grouping functions

### 2. Extract Common Filter Components

- **TitleFilter**: Used in remaining 5+ components
  ```tsx
  <DebouncedInput
    label="Title"
    onInputChange={(value) => dispatch({ type: Actions.FILTER_TITLE, value })}
    placeholder="Enter all or part of a title"
  />
  ```
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

### 5. Extract Letter Extraction Utility

- **Duplicated 6+ times**:
  ```typescript
  const letter = value.sortTitle.slice(0, 1);
  if (letter.toLowerCase() == letter.toUpperCase()) {
    return "#";
  }
  return value.sortTitle.slice(0, 1).toLocaleUpperCase();
  ```

### 6. Consolidate Sort Comparators

- Title sorting (with collator)
- Date sorting
- Grade sorting
- Sequence sorting

### 7. Standardize Type Definitions

- Create shared ListItemValue type
- Standardize Sort type definitions
- Common filter action types

### 8. Apply New Abstractions

- Refactor Viewings, Watchlist, Collection components
- Update remaining list components to use new patterns

## Low Priority Tasks

### 9. Create ListItemWithHover Component

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

### 10. Standardize Backdrop Components

- Similar structure across multiple components
- Extract common backdrop pattern

### 11. Extract Constants

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

## Progress Summary

### Completed

- ✅ Reviews reducer consolidation: ~1,200 lines saved
- ✅ Reviews filters unification: ~400 lines saved
- ✅ Removed 8 redundant files

### Remaining Potential

- **Code reduction**: 2,300-3,300 additional lines
- **Maintenance improvement**: Changes need updates in only one place
- **Better testability**: Test generic components once
- **Improved consistency**: Standardized patterns across codebase
- **Easier onboarding**: Less duplicate code to understand
