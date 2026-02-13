# Filter UI Redesign - Implementation Plan

## Overview

This plan outlines the step-by-step implementation of the filter redesign from dropdowns to checkbox lists with collapsible sections. The work is broken into manageable stages to ensure each piece works before moving to the next.

**Target:** All 7 filterable pages converted to new checkbox-based filter UI
**Approach:** Incremental, test-driven, one feature at a time

---

## Stage 1: Foundation - Core Components

**Goal:** Create new reusable components that will replace existing dropdown-based fields

**Success Criteria:**

- Components render correctly
- Full keyboard navigation works
- Screen reader announces states properly
- All tests pass

### Tasks

#### 1.1 Create CheckboxListField Component

**File:** `/src/components/fields/CheckboxListField.tsx`

**Features:**

- Accepts list of options with labels, values, and counts
- Supports multi-selection via checkboxes
- "Show more" functionality (no "show less" - collapse section instead)
- Configurable threshold (default: 3)
- Selected items automatically move to top of list (alphabetical order for unselected)
- Clear link beneath options (only visible when selections exist)
- Full keyboard navigation (Tab, Space to toggle)
- Proper ARIA attributes including aria-live for count updates

**Props:**

```typescript
interface CheckboxListFieldProps {
  label: string;
  options: Array<{
    label: string;
    value: string;
    count: number;
  }>;
  defaultValues?: readonly string[];
  onChange: (values: string[]) => void;
  onClear?: () => void;
  showMoreThreshold?: number; // Default: 3
}
```

**Test File:** `/src/components/fields/CheckboxListField.spec.tsx`

**Tests:**

- Renders all options when count ≤ threshold
- Shows "Show more" link when count > threshold
- Expands on "Show more" click (stays expanded)
- Toggles checkbox on Space key
- Moves checked items to top (alphabetical for unselected)
- Shows Clear link only when selections exist
- Clear link removes all selections
- Calls onChange with selected values
- Calls onClear when Clear clicked
- Form reset clears selections
- Screen reader announcements (via aria-label and aria-live testing)

**Estimated Complexity:** High (similar complexity to MultiSelectField)

---

#### 1.2 Create RadioListField Component

**File:** `/src/components/fields/RadioListField.tsx`

**Features:**

- Accepts list of options with labels, values, and counts
- Single selection via radio buttons
- No "Show more" needed (typically < 5 options)
- Clear link beneath options (resets to default value)
- Full keyboard navigation (Tab, Space/Enter to select)
- Proper ARIA attributes

**Props:**

```typescript
interface RadioListFieldProps {
  label: string;
  options: Array<{
    label: string;
    value: string;
    count: number;
  }>;
  defaultValue?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}
```

**Test File:** `/src/components/fields/RadioListField.spec.tsx`

**Tests:**

- Renders all options
- Only one option selectable at a time
- Space/Enter toggles selection
- Shows Clear link only when non-default value selected
- Clear link resets to default value
- Calls onChange with selected value
- Calls onClear when Clear clicked
- Form reset reverts to default
- Screen reader announcements

**Estimated Complexity:** Medium

---

#### 1.3 Create FilterSection Component

**File:** `/src/components/filter-and-sort/FilterSection.tsx`

**Features:**

- Wraps filter fields in collapsible `<details>` / `<summary>` structure
- Shows selection count in summary when collapsed ("N selected")
- Keyboard accessible (Enter/Space to toggle)
- No Clear link in summary (that's in field components)

**Props:**

```typescript
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  selectionCount?: number;
}
```

**Test File:** `/src/components/filter-and-sort/FilterSection.spec.tsx`

**Tests:**

- Renders expanded when defaultOpen={true}
- Renders collapsed when defaultOpen={false}
- Shows "(N selected)" in summary when collapsed and selectionCount > 0
- Toggles on summary click
- Keyboard navigation works

**Estimated Complexity:** Low-Medium

---

#### 1.4 Create AppliedFilters Component

**File:** `/src/components/filter-and-sort/AppliedFilters.tsx`

**Features:**

- Displays active filters as removable chips (including text search)
- Shows "Clear all" link
- Animates chips on add/remove (optional Phase 1, required Phase 4)
- Full keyboard support for chip removal
- Hidden when no filters active

**Props:**

```typescript
interface FilterChip {
  id: string; // Unique identifier (e.g., "genre-horror", "search")
  category: string; // Display category (e.g., "Genre", "Search")
  label: string; // Display value (e.g., "Horror", "alien")
}

interface AppliedFiltersProps {
  filters: FilterChip[]; // Includes search query chips
  onRemove: (id: string) => void;
  onClearAll: () => void;
}
```

**Test File:** `/src/components/filter-and-sort/AppliedFilters.spec.tsx`

**Tests:**

- Renders nothing when filters array is empty
- Renders chip for each filter (including search chips)
- Calls onRemove with correct id when × clicked
- Calls onClearAll when "Clear all" clicked
- Keyboard navigation (Tab to chip, Enter/Space to remove)
- Proper ARIA labels
- Search chip formatted as "Search: [query]"

**Estimated Complexity:** Low-Medium

---

#### 1.5 Create RangeSliderField Component

**File:** `/src/components/fields/RangeSliderField.tsx`

**Features:**

- Dual-handle range slider
- Syncs with external from/to values (from YearField/GradeField dropdowns)
- Updates on slider drag
- Calls onChange with new from/to values
- Clear link beneath slider (resets to full range)
- Accessible keyboard controls (arrow keys to adjust handles)
- Visual feedback of selected range

**Props:**

```typescript
interface RangeSliderFieldProps {
  label: string;
  min: number; // Minimum value (e.g., 1920 for years)
  max: number; // Maximum value (e.g., 2026 for years)
  fromValue: number; // Current "from" value
  toValue: number; // Current "to" value
  onChange: (from: number, to: number) => void;
  onClear?: () => void; // Resets to min/max
  formatValue?: (value: number) => string; // Optional formatter (e.g., grade letters)
}
```

**Test File:** `/src/components/fields/RangeSliderField.spec.tsx`

**Tests:**

- Renders slider with correct min/max
- Shows current from/to values
- Updates on handle drag (simulated)
- Calls onChange with new values
- Shows Clear link only when range is not full (from !== min || to !== max)
- Clear resets to full range
- Keyboard navigation (arrow keys move handles)
- Proper ARIA labels and roles

**Implementation Note:**

- Can use native HTML `<input type="range">` with two inputs for dual handles
- Or use a library like `react-slider` or `rc-slider` if native solution is too limited
- Should match visual style of existing form controls

**Estimated Complexity:** Medium

---

### Stage 1 Status: Complete

**Completion Checklist:**

- [x] CheckboxListField.tsx created and tested
  - [x] Verify "Show more" text is EXACTLY "+ Show more" (no count)
  - [x] Verify selected items move to top (newest first)
  - [x] Verify unselected items alphabetical
  - [x] Verify Clear link beneath options
- [x] RadioListField.tsx created and tested
  - [x] Verify Clear link beneath options
  - **NOTE:** RadioListField will be deprecated in Stage 8 - Orbit DVD uses checkboxes for all filters (multi-select)
- [x] FilterSection.tsx created and tested
  - [x] Verify NO "(n selected)" text in summary
  - [x] Verify disclosure triangle rotates correctly
- [x] AppliedFilters.tsx created and tested
  - [x] Verify chips render with correct format
  - [x] Verify "Clear all" text exact
- [x] RangeSliderField.tsx created and tested
- [x] All component tests pass
- [x] npm run lint passes
- [x] npm run check passes
- [x] Manual testing: Keyboard navigation works
- [x] Manual testing: Screen reader announces correctly

---

## Stage 2: First Feature Conversion - Reviews Page

**Goal:** Convert Reviews page to use new checkbox-based filters, proving the architecture works end-to-end

**Success Criteria:**

- Reviews page filters work identically to old version
- All filter types represented (multi-select, range, text)
- Counts display correctly for each filter option
- Applied filters section shows/hides correctly
- All existing tests updated and passing
- No regressions in functionality

### Tasks

#### 2.1 Add Count Calculation Helper

**File:** `/src/features/reviews/filterReviews.ts` (modify existing)

**Add function:**

```typescript
export function calculateGenreCounts(
  reviews: ReviewWithContent[],
): Map<string, number> {
  // Count how many reviews have each genre
  // Return Map of genre -> count
}

export function calculateYearCounts(reviews: ReviewWithContent[]): {
  min: number;
  max: number;
  counts: Map<number, number>;
} {
  // Calculate year range and counts per year
}

// Similar for other filter dimensions
```

**Test:** Add tests to existing `filterReviews.spec.ts`

**Estimated Complexity:** Low (pure function, straightforward)

---

#### 2.2 Update Reviews Reducer to Support Applied Filters

**File:** `/src/features/reviews/Reviews.reducer.ts` (modify existing)

**Add action:**

```typescript
type Action =
  | ... existing actions ...
  | { type: "REMOVE_APPLIED_FILTER"; filterKey: string; value?: string }

// Add handler for removing individual applied filters
```

**Test:** Update `Reviews.reducer.spec.ts`

**Estimated Complexity:** Low

---

#### 2.3 Convert ReviewsFilters Component

**File:** `/src/features/reviews/ReviewsFilters.tsx` (modify existing)

**Changes:**

- Import new CheckboxListField, FilterSection, AppliedFilters
- Calculate counts for each filter option using helpers from 2.1
- Replace `<MultiSelectField>` with:
  ```tsx
  <FilterSection
    title="Genres"
    hasSelections={selectedGenres.length > 0}
    selectionCount={selectedGenres.length}
    onClear={() => dispatch({ type: "CLEAR_GENRE_FILTER" })}
  >
    <CheckboxListField
      label="Genres"
      options={genreOptions} // with counts
      defaultValues={selectedGenres}
      onChange={(values) => dispatch({ type: "GENRE_FILTER", values })}
    />
  </FilterSection>
  ```
- Add AppliedFilters at top:
  ```tsx
  <AppliedFilters
    filters={buildAppliedFilterChips(activeFilterValues)}
    onRemove={(id) => dispatch({ type: "REMOVE_APPLIED_FILTER", filterId: id })}
    onClearAll={() => dispatch({ type: "CLEAR_FILTERS" })}
  />
  ```
- Keep YearField and GradeField as-is (unchanged in Phase 1)

**Test:** Update `ReviewsFilters.spec.tsx`

**Estimated Complexity:** Medium

---

#### 2.4 Build Applied Filter Chips Helper

**File:** `/src/features/reviews/appliedFilterChips.ts` (new)

**Function:**

```typescript
export function buildAppliedFilterChips(
  filterValues: ReviewsFilterValues,
): FilterChip[] {
  // Convert active filter values into chip format
  // Example: { genres: ["Horror", "Action"] }
  //   → [
  //        { id: "genre-horror", category: "Genre", label: "Horror" },
  //        { id: "genre-action", category: "Genre", label: "Action" }
  //      ]
}
```

**Test:** `appliedFilterChips.spec.ts`

**Estimated Complexity:** Low

---

#### 2.5 Update FilterAndSortContainer

**File:** `/src/components/filter-and-sort/FilterAndSortContainer.tsx` (modify existing)

**Changes:**

- Accept new prop: `activeFilters: FilterChip[]`
- Accept new prop: `onRemoveFilter: (id: string) => void`
- Render AppliedFilters at top of drawer (before children)
- Pass through callbacks

**No breaking changes:** Component still works if props not provided (backward compatible)

**Test:** Update `FilterAndSortContainer.spec.tsx`

**Estimated Complexity:** Low

---

#### 2.6 Update AllReviews Page Component

**File:** `/src/features/reviews/AllReviews.tsx` (modify existing)

**Changes:**

- Import `buildAppliedFilterChips`
- Calculate `activeFilters` from state
- Pass to FilterAndSortContainer:
  ```tsx
  <FilterAndSortContainer
    activeFilters={buildAppliedFilterChips(state.activeFilterValues)}
    onRemoveFilter={(id) => dispatch({ type: "REMOVE_APPLIED_FILTER", filterId: id })}
    ...existing props...
  >
  ```

**Test:** Update `AllReviews.spec.tsx` (may need new snapshots)

**Estimated Complexity:** Low

---

**CRITICAL: Verify AppliedFilters shows pending filters**

The activeFilters prop passed to FilterAndSortContainer MUST be built from `state.pendingFilterValues`, NOT `state.activeFilterValues`. This ensures AppliedFilters updates in real-time as user checks/unchecks boxes.

**Correct pattern:**

```typescript
const activeFilters = buildAppliedFilterChips(state.pendingFilterValues);
```

**Wrong pattern:**

```typescript
const activeFilters = buildAppliedFilterChips(state.activeFilterValues); // ❌ Only updates on Apply
```

**Test verification:** After checking a box in the drawer, AppliedFilters must immediately show the new chip WITHOUT clicking "View Results" first.

---

#### 2.7 Update Page-Level Tests

**File:** `/src/pages/reviews/index.spec.tsx` (modify existing)

**Changes:**

- Update snapshots (checkboxes instead of dropdowns)
- Add interaction tests for new UI:
  - Click checkbox to select genre
  - Click "Show more" to expand
  - Click × on applied filter chip to remove
  - Click "Clear all" to remove all filters

**Estimated Complexity:** Medium

---

### Stage 2 Status: Not Started

**Completion Checklist:**

- [ ] Count calculation helpers added and tested
- [ ] Reviews reducer updated for applied filter removal
- [ ] ReviewsFilters component converted to checkboxes
- [ ] Applied filter chips helper created
- [ ] FilterAndSortContainer updated (backward compatible)
- [ ] AllReviews page component updated
- [ ] All tests updated and passing
- [ ] Manual testing: Reviews page filters work correctly
- [ ] Accessibility testing: Keyboard nav, screen reader
- [ ] npm run build succeeds
- [ ] npm run lint passes
- [ ] npm run check passes

**Drift Prevention Checklist:**

- [ ] Visual inspection: "Show more" has no count in text
- [ ] Interaction test: Checking box immediately shows chip in AppliedFilters
- [ ] Interaction test: Unchecking box immediately removes chip from AppliedFilters
- [ ] Visual inspection: No "(n selected)" text appears in any filter summary
- [ ] Visual inspection: Clear link positioned beneath options, not in summary header
- [ ] Code review: All text strings match spec exactly (no variations)

---

## Stage 3: Remaining Review-Type Pages

**Goal:** Convert the other pages that have similar filter patterns to Reviews

**Success Criteria:**

- All pages work identically to Reviews
- Code duplication minimized via shared helpers
- All tests passing

### Pages to Convert:

1. **Cast & Crew Member Titles** (`/cast-and-crew/[slug]/`)
   - Similar to Reviews (genres, years, grades, reviewed status)
   - Add credited-as filter (RadioListField)

2. **Collection Titles** (`/collections/[slug]/`)
   - Nearly identical to Reviews
   - Add reviewed status filter (RadioListField)

### Tasks

#### 3.1 Cast & Crew Member Titles

**Files:**

- `/src/features/cast-and-crew-member-titles/CastAndCrewMemberTitlesFilters.tsx`
- `/src/features/cast-and-crew-member-titles/appliedFilterChips.ts` (new)
- `/src/features/cast-and-crew-member-titles/filterCastAndCrewMemberTitles.ts` (add counts)
- `/src/features/cast-and-crew-member-titles/CastAndCrewMemberTitles.tsx`
- `/src/features/cast-and-crew-member-titles/CastAndCrewMemberTitles.reducer.ts`

**Changes:**

- Same pattern as Reviews (Stage 2)
- Add count helpers
- Convert MultiSelectField → CheckboxListField
- Convert CreditedAsFilter → RadioListField (if needed, or keep as-is)
- Add AppliedFilters

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Low (repeat of Stage 2 pattern)

---

#### 3.2 Collection Titles

**Files:**

- `/src/features/collection-titles/CollectionTitlesFilters.tsx`
- `/src/features/collection-titles/appliedFilterChips.ts` (new)
- `/src/features/collection-titles/filterCollectionTitles.ts` (add counts)
- `/src/features/collection-titles/CollectionTitles.tsx`
- `/src/features/collection-titles/CollectionTitles.reducer.ts`

**Changes:**

- Same pattern as Reviews
- Add ReviewedStatusFilter conversion to RadioListField

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Low

---

### Stage 3 Status: Not Started

**Completion Checklist:**

- [ ] Cast & Crew Member Titles converted
- [ ] Collection Titles converted
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Accessibility testing complete

**Drift Prevention Checklist:**

- [ ] Visual inspection: "Show more" has no count in text
- [ ] Interaction test: Checking box immediately shows chip in AppliedFilters
- [ ] Interaction test: Unchecking box immediately removes chip from AppliedFilters
- [ ] Visual inspection: No "(n selected)" text appears in any filter summary
- [ ] Visual inspection: Clear link positioned beneath options, not in summary header
- [ ] Code review: All text strings match spec exactly (no variations)

---

## Stage 4: Watchlist & Viewings Pages

**Goal:** Convert pages with unique filter combinations

**Success Criteria:**

- All custom filter fields work with new checkbox pattern
- CreditSelectField adapted or replaced
- All tests passing

### Pages to Convert:

1. **Watchlist** (`/watchlist/`)
   - Has unique CreditSelectField (Director, Performer, Writer, Collection)
   - Needs custom handling

2. **Viewings** (`/viewings/`)
   - Has Medium and Venue single-select filters
   - Convert to RadioListField

### Tasks

#### 4.1 Watchlist - Handle CreditSelectField

**Current:** CreditSelectField is a custom wrapper around MultiSelectField

**Option A:** Convert to CheckboxListField

- Create helper to format credit options with counts
- Replace CreditSelectField → CheckboxListField + FilterSection

**Option B:** Create CreditCheckboxField wrapper

- New component wrapping CheckboxListField
- Maintains credit-specific logic (avatar images, formatting)

**Files:**

- `/src/features/watchlist/WatchlistFilters.tsx`
- `/src/features/watchlist/appliedFilterChips.ts` (new)
- `/src/features/watchlist/filterWatchlist.ts` (add counts)
- `/src/features/watchlist/Watchlist.tsx`
- `/src/features/watchlist/Watchlist.reducer.ts`

**Decision needed:** Option A (simpler) vs Option B (more encapsulated)

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Medium-High

---

#### 4.2 Viewings

**Files:**

- `/src/features/viewings/ViewingsFilters.tsx`
- `/src/features/viewings/appliedFilterChips.ts` (new)
- `/src/features/viewings/filterViewings.ts` (add counts)
- `/src/features/viewings/Viewings.tsx`
- `/src/features/viewings/Viewings.reducer.ts`

**Changes:**

- Convert Medium SelectField → RadioListField
- Convert Venue SelectField → RadioListField
- Convert ReviewedStatusFilter → RadioListField
- Add AppliedFilters

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Low-Medium

---

### Stage 4 Status: Not Started

**Completion Checklist:**

- [ ] Watchlist converted (CreditSelectField handled)
- [ ] Viewings converted
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Accessibility testing complete

**Drift Prevention Checklist:**

- [ ] Visual inspection: "Show more" has no count in text
- [ ] Interaction test: Checking box immediately shows chip in AppliedFilters
- [ ] Interaction test: Unchecking box immediately removes chip from AppliedFilters
- [ ] Visual inspection: No "(n selected)" text appears in any filter summary
- [ ] Visual inspection: Clear link positioned beneath options, not in summary header
- [ ] Code review: All text strings match spec exactly (no variations)

---

## Stage 5: Cast & Crew and Collections List Pages

**Goal:** Convert the simpler list pages

**Success Criteria:**

- CreditedAsFilter converted to RadioListField
- Text-only search remains simple
- All tests passing

### Pages to Convert:

1. **Cast & Crew** (`/cast-and-crew/`)
   - Text search (keep TextField)
   - CreditedAsFilter → RadioListField

2. **Collections** (`/collections/`)
   - Text search only (keep TextField)
   - May not need AppliedFilters (no non-text filters)

### Tasks

#### 5.1 Cast & Crew

**Files:**

- `/src/features/cast-and-crew/CastAndCrewFilters.tsx`
- `/src/features/cast-and-crew/appliedFilterChips.ts` (new, minimal)
- `/src/features/cast-and-crew/CastAndCrew.tsx`
- `/src/features/cast-and-crew/CastAndCrew.reducer.ts`

**Changes:**

- Convert CreditedAsFilter to RadioListField
- Add AppliedFilters (will only show credited-as chip)

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Low

---

#### 5.2 Collections

**Files:**

- `/src/features/collections/CollectionsFilters.tsx`

**Changes:**

- Keep TextField as-is
- May skip AppliedFilters (no chip-able filters)
- Or add AppliedFilters for consistency (shows "Search: [query]" chip)

**Decision needed:** Add AppliedFilters for search query or skip?

**Tests:** Update all corresponding .spec.tsx files

**Estimated Complexity:** Very Low

---

### Stage 5 Status: Not Started

**Completion Checklist:**

- [ ] Cast & Crew converted
- [ ] Collections evaluated (AppliedFilters decision made)
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Accessibility testing complete

**Drift Prevention Checklist:**

- [ ] Visual inspection: "Show more" has no count in text
- [ ] Interaction test: Checking box immediately shows chip in AppliedFilters
- [ ] Interaction test: Unchecking box immediately removes chip from AppliedFilters
- [ ] Visual inspection: No "(n selected)" text appears in any filter summary
- [ ] Visual inspection: Clear link positioned beneath options, not in summary header
- [ ] Code review: All text strings match spec exactly (no variations)

---

## Stage 6: Cleanup & Deprecation

**Goal:** Remove old components that are no longer used

**Success Criteria:**

- All old components deleted
- No references to old components in codebase
- Bundle size reduced

### Tasks

#### 6.1 Verify No Usage of Old Components

**Command:**

```bash
npm run knip
```

**Check for:**

- MultiSelectField.tsx (should be unused)
- Old SelectField wrappers (if fully replaced)

#### 6.2 Delete Old Components

**Files to remove:**

- `/src/components/fields/MultiSelectField.tsx` (if fully replaced)
- `/src/components/fields/MultiSelectField.spec.tsx`
- Any old wrapper components (CreditSelectField.tsx, etc.)

**IMPORTANT:** Only delete after confirming zero usage

#### 6.3 Update Imports

**Search for:**

```bash
grep -r "MultiSelectField" src/
```

**Ensure:** No remaining imports

### Stage 6 Status: Not Started

**Completion Checklist:**

- [ ] Knip confirms no usage of old components
- [ ] Old component files deleted
- [ ] No broken imports
- [ ] npm run build succeeds
- [ ] Bundle size comparison (before/after)

**Drift Prevention Checklist:**

- [x] All old components removed (no drift possible in deleted code)
- [x] No references to MultiSelectField remain
- [x] Bundle size reduced compared to before

---

## Stage 7: Polish & Optimization

**Goal:** Add animations, optimize performance, finalize UX details

**Success Criteria:**

- Smooth animations (60fps)
- No perceptible lag
- Finalized "Show more" threshold
- User testing feedback addressed

### Tasks

#### 7.1 Add Animations

**Components:**

- AppliedFilters.tsx: Fade in/out chips
- FilterSection.tsx: Smooth expand/collapse
- CheckboxListField.tsx: Smooth show more/less

**CSS:**

- Use Tailwind transition utilities
- Test on low-end devices

**Estimated Complexity:** Low-Medium

---

#### 7.2 Performance Optimization

**If needed (test first):**

- Virtualize very long checkbox lists (100+ items)
- Debounce count calculations
- Memoize expensive renders

**Measure:**

- React DevTools Profiler
- Lighthouse performance score

**Estimated Complexity:** Medium (only if needed)

---

#### 7.3 A/B Test "Show More" Threshold

**Test values:**

- 3 items (conservative)
- 5 items (moderate)
- 7 items (generous)

**Method:**

- User feedback
- Analytics (if available)
- Personal preference

**Decision:** Set final default value in CheckboxListField

**Estimated Complexity:** Low (config change)

---

#### 7.4 Final Accessibility Audit

**Tools:**

- axe DevTools
- Lighthouse accessibility score
- Manual screen reader testing (VoiceOver, NVDA, JAWS)

**Checklist:**

- All WCAG 2.1 AA criteria met
- Keyboard navigation tested on all pages
- Focus management tested
- Color contrast verified

**Estimated Complexity:** Low (mostly validation)

---

### Stage 7 Status: Not Started

**Completion Checklist:**

- [ ] Animations added and smooth
- [ ] Performance validated (no lag)
- [ ] "Show more" threshold finalized
- [ ] Final accessibility audit complete
- [ ] User feedback collected and addressed
- [ ] All pages tested end-to-end

**Final Drift Prevention Checklist:**

- [ ] Visual inspection on ALL 7 pages: "Show more" has no count
- [ ] Interaction test on ALL 7 pages: AppliedFilters updates in real-time
- [ ] Visual inspection on ALL 7 pages: No "(n selected)" text anywhere
- [ ] Visual inspection on ALL 7 pages: Clear links beneath options, not in summaries
- [ ] Code review: Search codebase for any hardcoded counts in "Show more" text
- [ ] Code review: Search codebase for any "(n selected)" or "selected)" strings
- [ ] Manual test: Open each page, check box, verify chip appears immediately (before clicking Apply)

---

## Stage 8: Corrections Based on Orbit DVD Reference

**Goal:** Correct implementation to match Orbit DVD reference behavior

**Success Criteria:**

- All filter sections open by default
- Disclosure triangle on far right
- Range sliders integrated beneath Year/Grade fields
- Applied filter chips show value only (not "Category: Value")
- All filters allow multiple selection (RadioListField → CheckboxListField)
- CreditedAs counts show non-zero values
- All tests passing
- Matches Orbit DVD behavior

**Reference:** https://www.orbitdvd.com/collections/all-recently-added

### Tasks

#### 8.1 Fix FilterSection Default State and Triangle Position

**Files:**

- `/src/components/filter-and-sort/FilterSection.tsx`
- `/src/components/filter-and-sort/FilterSection.spec.tsx`

**Changes:**

- Change `defaultOpen = false` to `defaultOpen = true`
- Move disclosure triangle to far right (after title, use flexbox justify-between)
- Update tests for new default state
- Update snapshots for triangle position

**Tests:** FilterSection unit tests + all page snapshots

**Estimated Complexity:** Low

---

#### 8.2 Fix AppliedFilters Chip Display Format

**Files:**

- `/src/components/filter-and-sort/AppliedFilters.tsx`
- `/src/components/filter-and-sort/AppliedFilters.spec.tsx`

**Changes:**

- Update display logic: show just `label` for simple filters
- Keep `"${category}: ${label}"` for range filters (Grade, Year)
- Update tests for new format

**Tests:** AppliedFilters unit tests

**Estimated Complexity:** Low

---

#### 8.3 Integrate Range Sliders with Year/Grade Fields

**Files:**

- `/src/components/fields/YearField.tsx`
- `/src/components/fields/GradeField.tsx`
- `/src/components/fields/YearField.spec.tsx` (create)
- `/src/components/fields/GradeField.spec.tsx` (create)
- All filter components using these fields

**Changes:**

- Import and render RangeSliderField beneath dropdown selects
- Wire onChange to sync slider ↔ dropdowns bidirectionally
- Add Clear handler that resets both slider and dropdowns
- Create comprehensive tests for both components
- Verify on all pages using year/grade filters

**Tests:** YearField + GradeField unit tests + all page integration tests

**Estimated Complexity:** Medium

---

#### 8.4 Convert RadioListField to CheckboxListField

**Goal:** Allow multiple selection for all filters (Medium, Venue, ReviewedStatus, CreditedAs, Credits)

This is the largest change, broken into sub-tasks:

##### 8.4a Update Medium Filter (Viewings)

**Files:**

- `/src/features/viewings/ViewingsFilters.tsx`
- `/src/features/viewings/Viewings.reducer.ts`
- `/src/features/viewings/filterViewings.ts`
- `/src/features/viewings/appliedFilterChips.ts`
- `/src/features/viewings/Viewings.spec.tsx`

**Changes:**

1. Replace RadioListField with CheckboxListField in ViewingsFilters
2. Update reducer: `medium: string` → `medium: readonly string[]`
3. Update filterViewings to filter by array of mediums
4. Update calculateMediumCounts to handle array
5. Update appliedFilterChips to create one chip per medium value
6. Update all tests

**Estimated Complexity:** Medium

##### 8.4b Update Venue Filter (Viewings)

**Same files as 8.4a**

**Changes:**
Similar to 8.4a for venue filter

**Estimated Complexity:** Medium

##### 8.4c Update Reviewed Status Filter (Collection Titles, Cast & Crew Member Titles)

**Files:**

- `/src/components/filter-and-sort/MaybeReviewedTitleFilters.tsx`
- `/src/reducers/maybeReviewedTitleFiltersReducer.ts`
- `/src/features/collection-titles/filterCollectionTitles.ts`
- `/src/features/collection-titles/appliedFilterChips.ts`
- `/src/features/cast-and-crew-member-titles/filterCastAndCrewMemberTitles.ts`
- `/src/features/cast-and-crew-member-titles/appliedFilterChips.ts`
- All affected test files

**Changes:**

1. Replace RadioListField with CheckboxListField
2. Update reducer: `reviewedStatus: string` → `reviewedStatus: readonly string[]`
3. Update filterers to handle array
4. Update calculateReviewedStatusCounts functions
5. Update appliedFilterChips builders (one chip per status)
6. Update all tests

**Estimated Complexity:** High (affects multiple pages)

##### 8.4d Update Credited As Filter (Cast & Crew Member Titles)

**Files:**

- `/src/components/filter-and-sort/CreditedAsFilter.tsx`
- `/src/features/cast-and-crew-member-titles/CastAndCrewMemberTitles.reducer.ts`
- `/src/features/cast-and-crew-member-titles/filterCastAndCrewMemberTitles.ts`
- `/src/features/cast-and-crew-member-titles/appliedFilterChips.ts`
- All affected test files

**Changes:**

1. Replace RadioListField with CheckboxListField
2. Update reducer: `creditedAs: string` → `creditedAs: readonly string[]`
3. Update filterer to handle array of credits
4. Update calculateCreditedAsCounts (may fix 0 counts bug)
5. Update appliedFilterChips (one chip per credit)
6. Update all tests

**Estimated Complexity:** Medium

##### 8.4e Update Watchlist Credit Filters (Director, Performer, Writer, Collection)

**Files:**

- `/src/features/watchlist/WatchlistFilters.tsx`
- `/src/features/watchlist/Watchlist.reducer.ts`
- `/src/features/watchlist/filterWatchlistValues.ts`
- `/src/features/watchlist/appliedFilterChips.ts`
- All affected test files

**Changes:**

1. Replace all 4 RadioListFields with CheckboxListFields
2. Update reducer: all credit fields `string` → `readonly string[]`
3. Update filterer to handle arrays for all credits
4. Update all calculate\*Counts functions
5. Update appliedFilterChips (one chip per credit value)
6. Update all tests

**Estimated Complexity:** High (4 filters affected)

---

#### 8.5 Fix CreditedAs 0 Counts Bug

**Files:**

- `/src/features/cast-and-crew/filterCastAndCrew.ts`
- `/src/features/cast-and-crew/filterCastAndCrew.spec.ts`

**Changes:**

- Debug calculateCreditedAsCounts function
- Add tests verifying non-zero counts
- May be resolved by 8.4d if related to RadioListField

**Estimated Complexity:** Low-Medium

---

#### 8.6 Remove RadioListField Component (Cleanup)

**Files:**

- `/src/components/fields/RadioListField.tsx`
- `/src/components/fields/RadioListField.spec.tsx`
- `/src/components/fields/RadioListField.testHelper.ts`

**Changes:**

- Verify zero usage with `npm run knip`
- Delete component files
- Update any import references
- Document in progress.txt

**Estimated Complexity:** Low

**IMPORTANT:** Only complete after all conversions in 8.4 are done and tested

---

### Stage 8 Status: Complete

**Completion Checklist:**

- [x] FilterSection opens by default, triangle on right
- [x] AppliedFilters shows value only (not "Category: Value")
- [x] Year/Grade fields have range sliders integrated
- [x] Medium filter uses checkboxes (multi-select)
- [x] Venue filter uses checkboxes (multi-select)
- [x] Reviewed Status filter uses checkboxes (multi-select)
- [x] Credited As filter uses checkboxes (multi-select)
- [x] Watchlist credit filters use checkboxes (multi-select)
- [x] CreditedAs counts show non-zero values
- [x] RadioListField component removed
- [x] All tests passing (589+)
- [x] All quality checks passing (lint, check, knip, format)
- [x] Visual comparison with Orbit DVD confirms matching behavior

**Drift Prevention Checklist:**

- [ ] Visual inspection: ALL FilterSections are open by default (regardless of selection state)
- [ ] Visual inspection: Disclosure triangle points down (▼) when open, up (▲) when closed
- [ ] Visual inspection: Disclosure triangle rotates 180° (not 90°) when toggling
- [ ] Interaction test: Clearing year range removes chip from AppliedFilters
- [ ] Interaction test: Clearing grade range removes chip from AppliedFilters
- [ ] Interaction test: Year range at full default (e.g., 1920-2024) does NOT show chip
- [ ] Interaction test: Grade range at full default (1-13) does NOT show chip
- [ ] Code review: No conditional defaultOpen logic in filter components
- [ ] Code review: All year range chips have full-range checks in appliedFilterChips
- [ ] Code review: Disclosure triangle SVG points down by default, rotates 180°

**Estimated Duration:** 15-22 hours

---

## Stage 9: Post-Implementation Corrections

**Goal:** Fix three issues discovered during Stage 8 implementation that don't match Orbit DVD reference

**Success Criteria:**

- All FilterSections open by default (no conditional logic)
- Disclosure triangle points down (▼) when open, up (▲) when closed
- Clearing year/grade ranges removes chips from AppliedFilters
- All unit tests passing
- All quality checks passing

### Issues Discovered

#### Issue 1: Sections Starting Closed Instead of Open

**Problem:** Filter components conditionally set `defaultOpen` based on existing selections, causing sections to be closed when no filters are active.

**Root Cause:** FilterSection correctly defaults to `defaultOpen={true}`, but filter components override with conditional logic.

**Files Affected:**

- `/src/components/filter-and-sort/TitleFilters.tsx`
- `/src/features/viewings/ViewingsFilters.tsx`
- Any other filter components with `defaultOpen={` pattern

**Solution:** Remove all conditional `defaultOpen` props and let FilterSection use its default `true` value.

---

#### Issue 2: Arrow Direction Incorrect

**Problem:** Disclosure triangle points right (→) when closed and rotates 90° to point down (↓) when opened. Should point down (▼) when open and up (▲) when closed (matching Orbit DVD).

**Current Implementation:**

- SVG path draws right-pointing triangle
- Rotates 90° on open
- `viewBox="0 0 8 12"`

**Required Implementation:**

- SVG path draws down-pointing triangle by default
- Rotates 180° on open (to point up)
- `viewBox="0 0 12 8"` (swapped dimensions)

**Files Affected:**

- `/src/components/filter-and-sort/FilterSection.tsx` (lines 45-55)
- `/src/components/filter-and-sort/FilterSection.spec.tsx` (update tests/snapshots)

**Solution:** Update SVG path to point down, change rotation from 90° to 180°.

---

#### Issue 3: Year/Grade Range Chips Persist After Clearing

**Problem:** Clicking "Clear" on year/grade range filters resets to full range but chip remains visible in AppliedFilters.

**Root Cause:** `buildAppliedFilterChips()` functions create chips for ALL year ranges, without checking if range equals full default range.

**Correct Pattern:** Grade filter has full-range check `if (minGrade !== 1 || maxGrade !== 13)` - year filters missing this.

**Challenge:** Year ranges are dynamic (vary by page), so full range must be passed as context to `buildAppliedFilterChips()`.

**Files Affected:**
All 7 `appliedFilterChips.ts` files:

1. `/src/features/reviews/appliedFilterChips.ts` - releaseYear, reviewYear
2. `/src/features/viewings/appliedFilterChips.ts` - releaseYear, viewingYear
3. `/src/features/watchlist/appliedFilterChips.ts` - releaseYear
4. `/src/features/collection-titles/appliedFilterChips.ts` - releaseYear, reviewYear
5. `/src/features/cast-and-crew-member-titles/appliedFilterChips.ts` - releaseYear, reviewYear
6. `/src/features/cast-and-crew/appliedFilterChips.ts` - (no year filters)
7. `/src/features/collections/appliedFilterChips.ts` - (no year filters)

Plus all page components that call `buildAppliedFilterChips()`:

- `/src/features/reviews/AllReviews.tsx`
- `/src/features/reviews/Overrated.tsx`
- `/src/features/reviews/Underrated.tsx`
- `/src/features/reviews/Underseen.tsx`
- `/src/features/viewings/Viewings.tsx`
- `/src/features/watchlist/Watchlist.tsx`
- `/src/features/collection-titles/CollectionTitles.tsx`
- `/src/features/cast-and-crew-member-titles/CastAndCrewMemberTitles.tsx`

**Solution:**

1. Update `buildAppliedFilterChips()` signatures to accept optional context with available years
2. Add full-range checks before creating year chips
3. Update all callers to pass available years

---

### Implementation Order

1. **Issue 2 first** (Arrow direction - isolated, no dependencies)
2. **Issue 1 second** (Sections open by default - simple, affects many files)
3. **Issue 3 last** (Year range chips - most complex, affects many files)

### Stage 9 Status: Not Started

**Completion Checklist:**

- [ ] Issue 2: Disclosure triangle points down when open, up when closed, rotates 180°
- [ ] Issue 1: All conditional `defaultOpen` logic removed from filter components
- [ ] Issue 3: All year range chips have full-range checks
- [ ] Issue 3: All `buildAppliedFilterChips()` functions accept year context
- [ ] Issue 3: All page components pass available years to chip builders
- [ ] All unit tests updated and passing
- [ ] All integration tests updated and passing
- [ ] All snapshots updated
- [ ] Manual verification: All three issues fixed
- [ ] Quality checks: lint, check, knip, format all passing

**Lessons Learned:**

1. **Conditional defaults are dangerous** - If a component has a sensible default, don't override it conditionally. The FilterSection default of `open={true}` should have been respected.

2. **Visual references matter** - The Orbit DVD reference specified down/up arrows with 180° rotation, but implementation used right/down arrows with 90° rotation. Always verify visual details against reference.

3. **Full-range checks need context** - When default ranges are dynamic, the chip builder needs context about what "full range" means. Grade filter had this right; year filters were missing it.

4. **Test across all pages** - These issues affected multiple pages but weren't caught because visual inspection wasn't comprehensive enough across all 7 filterable pages.

---

## Testing Strategy

### Per-Stage Testing

**After each stage:**

1. **Unit tests:** All new/modified component tests pass
2. **Integration tests:** Page-level tests pass
3. **Snapshot tests:** Review and approve snapshot changes
4. **Manual testing:**
   - Keyboard navigation
   - Screen reader announcements
   - Visual review (all breakpoints)
5. **Build validation:**
   - `npm run build` succeeds
   - `npm run lint` passes
   - `npm run lint:spelling` passes
   - `npm run check` passes
   - `npm run knip` passes
   - `npm run format` passes

### Final Testing (After Stage 7)

**Complete test suite:**

1. Full regression test of all 7 pages
2. Cross-browser testing (Chrome, Firefox, Safari, Edge)
3. Mobile device testing (iOS Safari, Android Chrome)
4. Accessibility audit (automated + manual)
5. Performance benchmarks
6. User acceptance testing (if applicable)

---

## Rollout Plan

### Option A: Feature Flag (Gradual Rollout)

**If confident:**

1. Deploy all stages to production
2. Monitor for issues
3. No flag needed (immediate switch)

**If cautious:**

1. Add feature flag to toggle old/new filters
2. Deploy with flag=false (old filters)
3. Test in production with flag=true (internal testing)
4. Gradually enable for percentage of users
5. Monitor metrics and feedback
6. Flip to 100% when stable
7. Remove old code + flag

### Option B: All-at-Once (Recommended)

**Since this is a personal site:**

- Complete all stages
- Test thoroughly locally
- Deploy to production
- Monitor for issues
- Fix any bugs immediately

**No need for gradual rollout** unless traffic is very high

---

## Risk Mitigation

### Potential Issues

1. **Performance:** Long checkbox lists (100+ items) may lag
   - **Mitigation:** Virtualization (react-window) if needed
   - **Test:** Measure render time before optimizing

2. **Accessibility:** Complex keyboard navigation may have gaps
   - **Mitigation:** Test early and often with screen readers
   - **Test:** Every stage includes accessibility checklist

3. **Browser compatibility:** Native `<details>` styling varies
   - **Mitigation:** Test on all major browsers
   - **Polyfill:** If needed (unlikely for modern browsers)

4. **Bundle size:** New components may increase JS size
   - **Mitigation:** Monitor build size, tree-shake old components
   - **Measure:** Compare before/after bundle sizes

5. **Regression:** Breaking existing functionality
   - **Mitigation:** Comprehensive test coverage + snapshots
   - **Validation:** Run full test suite after each stage

---

## Decision Log

### Decisions Made

1. **Use native `<details>` / `<summary>`** for collapsible sections
   - Pros: Built-in accessibility, no JS needed, standard HTML
   - Cons: Limited styling control (acceptable trade-off)

2. **Dual controls for range filters**
   - Dropdowns + sliders (both usable, stay in sync)
   - Users can choose preferred input method

3. **Dynamic counts** (matching Orbit DVD)
   - Update counts when other filters change
   - Based on pending filter state (real-time feedback)
   - More complex but better UX

4. **Filter UI patterns** (matching Orbit DVD)
   - "Show more" threshold: 3 items
   - "Show more" text: No count (just "Show more" for consistent width)
   - No "Show less": Collapse section instead
   - Sort order: Alphabetical (A-Z) for unselected items
   - Clear link: Beneath options, not in summary
   - Link layout: "[Show more] | [Clear]" on same line

5. **Text search chips**
   - Include in Applied Filters section
   - Format: "Search: [query]"

### Decisions Pending

1. **Watchlist CreditSelectField strategy:** Wrapper vs inline?
   - **Resolution needed:** Stage 4.1 (during Watchlist conversion)

2. **Animations:** Fade vs slide vs instant?
   - **Resolution needed:** Stage 7.1 (during polish)

3. **Sort order for unselected items:** Alphabetical vs by count?
   - **Resolution needed:** Stage 1 (during CheckboxListField implementation)

4. **Watchlist CreditSelectField strategy:** Wrapper vs inline?
   - **Resolution needed:** Stage 4.1 (during Watchlist conversion)

5. **Collections page AppliedFilters:** Include search query chip or skip?
   - **Resolution needed:** Stage 5.2 (during Collections conversion)

6. **Animations:** Fade vs slide vs instant?
   - **Resolution needed:** Stage 7.1 (during polish)

---

## Resources Needed

### Development

- Time estimate: ~20-30 hours total (all stages)
- Dependencies: None (all changes use existing libraries)
- Design assets: None (using existing Tailwind theme)

### Testing

- Screen reader access (VoiceOver on macOS, NVDA on Windows)
- Multiple browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS, Android)

### Documentation

- Update CLAUDE.md with new component patterns (after completion)
- Update MEMORY.md with lessons learned (during implementation)

---

## Success Criteria Summary

### Must Have (Blocking)

- [ ] All 7 pages converted
- [ ] All tests passing (unit, integration, snapshot)
- [ ] All build checks passing (lint, check, knip, format)
- [ ] Full keyboard navigation works
- [ ] Screen reader accessible (WCAG 2.1 AA)
- [ ] No regressions in functionality
- [ ] **Matches Orbit DVD reference behavior**

### Should Have (Important)

- [ ] Smooth animations (60fps)
- [ ] No perceptible performance lag
- [ ] Consistent UX across all pages
- [ ] Clear visual hierarchy
- [ ] Responsive on all breakpoints
- [ ] **All sections open by default**
- [ ] **Range sliders integrated beneath Year/Grade fields**
- [ ] **All filters allow multiple selection**

### Nice to Have (Optional)

- [x] Dynamic counts (update when other filters change) - **DONE**
- [ ] Range sliders for Year/Grade - **REQUIRED in Stage 8, not optional**
- [ ] Virtualization for very long lists
- [ ] Remember section open/closed state (localStorage)

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Answer open questions** - Make pending decisions
3. **Start Stage 1** - Build core components
4. **Iterate** - Complete each stage before moving to next
5. **Test thoroughly** - Don't skip accessibility testing
6. **Deploy** - Roll out when all stages complete

---

**Version:** 1.0
**Last Updated:** 2026-02-07
**Status:** Ready for Implementation
**Estimated Duration:** 3-4 weeks (part-time) or 1-2 weeks (full-time)
