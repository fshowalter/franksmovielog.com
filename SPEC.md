# Mobile Sort UX Enhancement Specification

## Overview

Improve the mobile user experience for filtering and sorting by consolidating sort controls into the filter drawer on mobile devices, following e-commerce best practices.

**Reference:** https://www.orbitdvd.com/collections/all-recently-added (mobile view)

## Current Behavior

### Mobile (< 640px)

- "Filter" button in header
- Sort dropdown visible in header between results count and filter button
- Filter drawer contains applied filters and filter sections
- Sort controls are separate from filters

### Desktop (≥ 640px)

- "Filter" button in header
- Sort dropdown visible in header
- Filter drawer contains applied filters and filter sections
- No changes needed for desktop behavior

## Proposed Behavior

### Mobile (< 640px)

1. **Header Changes:**
   - Change "Filter" button text to "Filter & Sort"
   - Hide the sort dropdown completely

2. **Filter Drawer Changes:**
   - Add a "Sort by" FilterSection
   - Display as radio button list
   - Position beneath AppliedFilters component
   - Show current sort selection
   - Update sort when radio button changes
   - Apply immediately (no need for "View Results" button for sort-only changes)

### Desktop (≥ 640px)

- No changes
- Maintain existing header sort dropdown
- Maintain existing "Filter" button text
- No sort section in drawer

## User Flows

### Mobile Sort Change

1. User taps "Filter & Sort" button
2. Drawer opens from right
3. If filters are applied, they appear first as chips
4. "Sort by" section appears next with radio buttons
5. Current sort option is pre-selected
6. User selects different sort option
7. Sort updates immediately, drawer remains open
8. User can continue to adjust filters or close drawer

### Mobile Filter Change

1. User taps "Filter & Sort" button
2. Drawer opens
3. User adjusts filters in various sections
4. "View X Results" button shows pending filter count
5. User taps "View Results"
6. Filters apply, drawer closes, list updates

### Mobile Combined Filter + Sort

1. User opens drawer
2. User changes sort (applies immediately)
3. User adjusts filters (pending)
4. User taps "View Results" to apply filters
5. Drawer closes with both sort and filters applied

## Critical Implementation Requirements

### 1. Responsive Behavior

- **MUST** use `tablet:` breakpoint (640px) as the dividing line
- **MUST** show "Filter & Sort" text only on mobile (< 640px)
- **MUST** hide header sort dropdown only on mobile (< 640px)
- **MUST** show drawer sort section only on mobile (< 640px)

### 2. Sort Section Structure

- **MUST** use `FilterSection` component for consistency
- **MUST** use radio inputs (native HTML radio buttons)
- **MUST** display sort options in same order as dropdown
- **MUST** pre-select current sort value
- **MUST** position sort section after `AppliedFilters` but before other filter sections

### 3. Sort Interaction

- **MUST** apply sort changes immediately (no delay)
- **MUST** keep drawer open after sort selection
- **MUST** scroll list to top when sort changes
- **MUST** update URL with new sort parameter
- **MUST** maintain existing `onSortChange` handler behavior

### 4. Accessibility

- **MUST** use semantic radio button group with proper fieldset/legend
- **MUST** provide clear labels for each sort option
- **MUST** indicate current selection with `checked` attribute
- **MUST** ensure keyboard navigation works (Tab, Arrow keys, Space/Enter)
- **MUST** maintain focus management within drawer

### 5. Component API

- **MUST NOT** break existing `FilterAndSortContainer` props
- **MUST NOT** require changes to consumer components (pages using the container)
- **SHOULD** keep `sortProps` prop structure unchanged
- **MAY** add internal helpers for radio button rendering

### 6. Testing Requirements

- **MUST** add tests for mobile vs desktop rendering
- **MUST** verify "Filter & Sort" text appears only on mobile
- **MUST** verify header dropdown hidden on mobile, visible on desktop
- **MUST** verify drawer sort section visible on mobile, hidden on desktop
- **MUST** test sort selection triggers `onSortChange` handler
- **MUST** test radio buttons reflect current sort value

## Visual Design Notes

Based on the reference site, the sort section should:

- Use the same `FilterSection` collapsible component as other filters
- Title: "Sort by"
- Default state: Open (like other filter sections)
- Radio buttons styled consistently with the theme
- Clear visual indication of selected option

## Files to Modify

### Primary Changes

1. `src/components/filter-and-sort/FilterAndSortHeader.tsx`
   - Add responsive class to hide sort dropdown on mobile
   - Change button text to "Filter & Sort" on mobile

2. `src/components/filter-and-sort/FilterAndSortContainer.tsx`
   - Add sort section to drawer (mobile only)
   - Position after AppliedFilters
   - Render radio button list

### New Components (Optional)

3. `src/components/filter-and-sort/SortSection.tsx` (if needed)
   - Encapsulate sort radio button logic
   - Reusable component for different sort option types

### Tests to Update

4. `src/components/filter-and-sort/FilterAndSortHeader.spec.tsx`
   - Test responsive button text
   - Test responsive sort dropdown visibility

5. `src/components/filter-and-sort/FilterAndSortContainer.spec.tsx`
   - Test drawer sort section on mobile
   - Test sort selection interaction

## Non-Goals

- Changing desktop behavior
- Modifying filter application logic
- Changing sort options content or order
- Adding new sort options
- Changing drawer animation or transition behavior

## Success Criteria

- [ ] Mobile users see "Filter & Sort" button text
- [ ] Mobile users do not see header sort dropdown
- [ ] Mobile users see "Sort by" section in filter drawer
- [ ] Sort changes apply immediately on mobile
- [ ] Desktop behavior unchanged
- [ ] All tests pass
- [ ] No accessibility regressions
- [ ] No visual regressions on desktop
