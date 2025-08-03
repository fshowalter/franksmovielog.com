# Refactoring Plan - Code Duplication Reduction

## Overview
This document outlines opportunities to reduce code duplication and minimize LOC count in the franksmovielog.com codebase. Estimated total reduction: 3,500-4,500 lines (~30-40% of component code).

## High Priority Tasks (Biggest Impact)

### 1. Create Generic Reducer Factory
- **Impact**: ~2,000-2,500 lines reduction
- **Details**: Create factory for common reducer patterns
  - SHOW_MORE action (identical in 8 files)
  - SORT action (identical in 8 files)
  - FILTER_TITLE action (identical in 7 files)
  - Year range filters (identical in 8 files)
  - Standard state initialization
  - Common sorting and grouping functions

### 2. Refactor Nearly Identical Reducers
- **Files**: Overrated, Underrated, Underseen reducers (95%+ identical)
- **Impact**: Eliminate 3 complete files
- **Approach**: Use generic reducer factory from task #1

### 3. Extract Common Filter Components
- **TitleFilter**: Used in 9+ components
  ```tsx
  <DebouncedInput
    label="Title"
    onInputChange={(value) => dispatch({ type: Actions.FILTER_TITLE, value })}
    placeholder="Enter all or part of a title"
  />
  ```
- **YearRangeFilter**: Used in 8+ components
- **DropdownFilter**: Used in 5+ components

### 4. Create FilteredListLayout HOC
- **Impact**: ~800-1,000 lines reduction
- **Pattern**: Encapsulate common list structure
  - useReducer setup
  - ListWithFiltersLayout structure
  - Common sorting/filtering logic

## Medium Priority Tasks

### 5. Create StandardFilters Composition
- Compose common filter sets into reusable component
- Parameters: showTitle, showReleaseYear, showReviewYear, etc.

### 6. Extract Letter Extraction Utility
- **Duplicated 6+ times**:
  ```typescript
  const letter = value.sortTitle.slice(0, 1);
  if (letter.toLowerCase() == letter.toUpperCase()) {
    return "#";
  }
  return value.sortTitle.slice(0, 1).toLocaleUpperCase();
  ```

### 7. Consolidate Sort Comparators
- Title sorting (with collator)
- Date sorting
- Grade sorting
- Sequence sorting

### 8. Standardize Type Definitions
- Create shared ListItemValue type
- Standardize Sort type definitions
- Common filter action types

### 9. Apply New Abstractions
- Refactor Reviews, Viewings, Watchlist components
- Update remaining list components to use new patterns

## Low Priority Tasks

### 10. Create ListItemWithHover Component
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

### 11. Standardize Backdrop Components
- Similar structure across multiple components
- Extract common backdrop pattern

### 12. Extract Constants
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
    groupedValues: groupValues(values.slice(0, SHOW_COUNT_DEFAULT), initialSort),
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

## Expected Outcomes

- **Code reduction**: 3,500-4,500 lines
- **Maintenance improvement**: Changes need updates in only one place
- **Better testability**: Test generic components once
- **Improved consistency**: Standardized patterns across codebase
- **Easier onboarding**: Less duplicate code to understand