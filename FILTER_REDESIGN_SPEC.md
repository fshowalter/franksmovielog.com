# Filter UI Redesign Specification

## Overview

Redesign all filter UI components from dropdown-based selects to checkbox-based lists with collapsible sections, matching modern e-commerce filter patterns (similar to Orbit DVD).

**Target Date:** TBD
**Scope:** All 7 filterable pages (reviews, watchlist, viewings, cast-and-crew, collections, cast-and-crew member titles, collection titles)

---

## Design Goals

1. **Improved Scannability** - See all available filter options at a glance
2. **Easier Multi-Selection** - Check/uncheck without opening dropdowns
3. **Better Transparency** - Show counts for each option
4. **Progressive Disclosure** - Collapse sections, show more/less for long lists
5. **Clear Feedback** - Applied filters section at top shows what's active
6. **Maintain Accessibility** - Full keyboard support, proper ARIA attributes

---

## Visual Design

### 1. Applied Filters Section (NEW)

**Location:** Top of filter drawer, above all filter sections
**Visibility:** Only shown when one or more filters are active

```
┌─────────────────────────────────────┐
│ Applied Filters:                    │
│                                      │
│ [Horror ×] [Action ×]                │
│ [Grade: A- to B+ ×]                  │
│ [Year: 1980-1989 ×]                  │
│                                      │
│ [Clear all]                          │
└─────────────────────────────────────┘
```

**Elements:**

- **Heading:** "Applied Filters:" (or just "Active Filters:")
- **Filter chips:** Rounded pills with filter label + remove button (×)
  - Color: Subtle background (canvas or stripe)
  - Text: Value only for simple filters (e.g., "Horror", "DVD"), Category + value for ranges (e.g., "Grade: A- to B+", "Year: 1980-1989")
  - Remove: × icon on right, clickable
- **Clear all link:** Text link below chips, removes all active filters
- **Animation:** Chips fade in/out when added/removed

**Interaction:**

- Click × on any chip → removes that specific filter
- Click "Clear all" → removes all filters (same as existing Clear button)
- Chips are keyboard accessible (tab to focus, Enter/Space to remove)

---

### 2. Filter Sections (Collapsible Details/Summary)

**Pattern:** Each filter category is a collapsible section using native `<details>` and `<summary>` elements

```
┌─────────────────────────────────────┐
│ Genres                            ▼ │  ← Summary (clickable)
├─────────────────────────────────────┤
│ ☐ Action (127)                      │
│ ☐ Comedy (98)                       │
│ ☐ Drama (215)                       │
│ ... (showing 3 of 24)               │
│ [+ Show 21 more]                    │  ← Show more link
└─────────────────────────────────────┘

(After expanding)
┌─────────────────────────────────────┐
│ Genres                            ▼ │
├─────────────────────────────────────┤
│ ☐ Action (127)                      │
│ ☐ Comedy (98)                       │
│ ☐ Drama (215)                       │
│ ☑ Horror (156)                      │  ← Checked
│ ☐ Romance (67)                      │
│ ... (showing all 24)                │
│ [Clear]                             │  ← Clear link beneath options
└─────────────────────────────────────┘

(After selection, collapsed view)
┌─────────────────────────────────────┐
│ Genres                            ▼ │
├─────────────────────────────────────┤
│ ☑ Horror (156)                      │  ← Selected items at top
│ ☐ Action (127)                      │
│ ☐ Comedy (98)                       │
│ ... (showing 3 of 24)               │
│ [+ Show 21 more]                    │
│ [Clear]                             │  ← Clear link visible when selected
└─────────────────────────────────────┘

(When collapsed)
┌─────────────────────────────────────┐
│ Genres                            ▲ │
└─────────────────────────────────────┘
```

**Elements:**

#### Summary (Always Visible)

- **Section title:** Filter category name (e.g., "Genres", "Release Year")
- **Disclosure triangle:** Points down (▼) when section is open, points up (▲) when section is closed (positioned on far right side)
  - **IMPORTANT:** Arrow rotates 180° (not 90°) when toggling between open/closed states

#### Details (Collapsible Content)

- **Checkbox items:** List of all available options
  - Checkbox (styled, accessible)
  - Label text
  - Count in parentheses (number of items matching this filter)
  - Each item is a full-width clickable area
  - **Counts are dynamic:** Update when other filters change (matching Orbit DVD)
- **Show more:** Only shown when total items > 3
  - Text link: "+ Show N more" (where N = total - 3)
  - Clicking expands to show ALL items
  - Not shown if total items ≤ 3
  - **No "Show less":** Users collapse the section via summary instead
- **Clear link:** Text link beneath all options
  - Only visible when items are selected in this section
  - Clicking clears ALL selections in that section
  - Keyboard accessible

**Default State:**

- **Open or closed?** All sections open by default (matching Orbit DVD pattern for better discoverability)
  - **CRITICAL:** Do NOT conditionally set `defaultOpen` based on filter state or existing selections
  - FilterSection component defaults to `defaultOpen={true}` - filter components should NOT override this
  - All sections should be open on page load regardless of whether filters are active
- **Initial limit:** Show first 3 items, hide rest behind "Show more"
- **After expanding:** All items visible (stays expanded until section collapsed)
- **State persistence:** User's open/closed state does NOT persist (resets on page load)

**Selection Behavior:**

- **Checked items:** Move to top of list when checked (grouped together)
- **Unchecked items:** Return to alphabetical sort order when unchecked
- **Sort order:**
  - Selected items: Order of selection (newest first)
  - Unselected items: Alphabetical (A-Z)

---

### 3. Special Filter Types

#### A. Multi-Select Filters (Checkboxes)

ALL filters allow multiple selection using checkboxes, matching the Orbit DVD pattern.

Examples:

- **Genres:** Horror, Action, Drama (select multiple)
- **Medium:** DVD, Blu-ray, 4K UHD (select multiple)
- **Venue:** Theater, Home (select multiple)
- **Reviewed Status:** Reviewed, Not Reviewed (select multiple)
- **Credited As:** Director, Performer, Writer (select multiple)

Users can select any combination of values. No "All" option needed - empty selection means "All".

#### B. Range Filters (Year, Grade)

Dual controls: Dropdowns + sliders (both usable and REQUIRED):

**IMPORTANT:** Range sliders MUST be rendered beneath Year/Grade dropdowns on all pages. The RangeSliderField component is built and tested - it MUST be integrated, not optional.

```
┌─────────────────────────────────────┐
│ ▼ Release Year                      │
├─────────────────────────────────────┤
│ From: [1980 ▼]                      │
│ To:   [1989 ▼]                      │
│                                      │
│ 1920  ●━━━━━━━━━━━●  2026          │  ← Range slider
│       1980      1989                │
│                                      │
│ [Clear]                             │
└─────────────────────────────────────┘
```

**Interaction:**

- Dropdowns and sliders stay in sync
- Changing dropdown updates slider position
- Dragging slider updates dropdown values
- Both controls are fully functional (user can choose preferred method)
- Clear link appears beneath when range is set (not default "All")

**Benefits:**

- Dropdowns: Precise year selection
- Sliders: Quick range adjustment, visual feedback

#### C. Text Search (Title, Name)

Keep existing TextField component, but add to Applied Filters:

```
┌─────────────────────────────────────┐
│ Title                               │
├─────────────────────────────────────┤
│ [Search by title...             🔍] │
└─────────────────────────────────────┘
```

**Applied Filters chip:**
When user enters search text, show chip:

```
Applied Filters:
[Search: "alien" ×]
```

Clicking × on chip clears the search field.

---

## Responsive Design

### Mobile (< tablet breakpoint)

- Filter sections stack vertically
- Full-width checkboxes (larger touch targets)
- "Show more" threshold: 3 items
- Applied filters at top collapse to 2 rows max, then scroll horizontally
- Clear links remain visible

### Tablet/Desktop

- Same layout (drawer is narrow, so single column is appropriate)
- "Show more" threshold: Could increase to 5 items (configurable)
- Applied filters wrap naturally

---

## Interaction Patterns

### 1. Selecting Filters

**Checkbox interaction:**

- Click anywhere on item row → toggles checkbox
- Keyboard: Tab to focus, Space to toggle
- Visual feedback:
  - Hover: Background color change
  - Checked: Checkbox filled, item moves to top
  - Focus: Outline/border highlight

**Immediate feedback:**

- Checked item moves to top of list (within expanded section)
- **Counts update dynamically** across all filter sections (items matching current filter state)
- Count updates in "View X Results" button immediately
- Applied filters section updates immediately (shows PENDING filters, not active)
  - As user checks/unchecks boxes: chips appear/disappear in real-time
  - User sees immediate feedback about what will be applied
  - When "View Results" clicked: pending becomes active, drawer closes
  - When drawer re-opened: AppliedFilters shows current pending state (initially matches active)

**Show More:**

- Text format: MUST be "+ Show more" (no count, for consistent width)
- Clicking expands to show all items
- Stays expanded until section is collapsed via summary
- Selected items remain visible even when showing limited items (always at top)
- When both "Show more" and "Clear" links visible, they appear on same line: "[Show more] | [Clear]"

### 2. Clearing Filters

**Per-section clear:**

- Click "Clear" link beneath filter options (not in summary)
- Unchecks all items in that section
- Section remains open
- Applied filters chips for that section disappear
- Other filter counts update dynamically

**Individual filter clear:**

- Click × on chip in Applied Filters section
- Unchecks corresponding checkbox
- Chip disappears with animation

**Clear all:**

- Click "Clear all" in Applied Filters section OR existing Clear button
- Unchecks all checkboxes across all sections
- Applied Filters section disappears
- All sections remain in current open/closed state

### 3. Collapsing Sections

**Open/Close:**

- Click anywhere on summary bar → toggles open/closed
- Keyboard: Tab to focus summary, Enter/Space to toggle
- Disclosure triangle rotates: ▶ (closed) ↔ ▼ (open)

**Default state:**

- All sections: Open by default (matching Orbit DVD pattern for better discoverability)
- User can collapse any section via summary click
- User's open/closed state does NOT persist (resets on page load)

### 4. Applying Filters

**No change to existing pattern:**

- Filters are applied in real-time (pending state)
- "View X Results" button shows count with pending filters
- Clicking applies pending → active
- Closing drawer without applying reverts pending → active

---

## Accessibility Requirements

### Keyboard Navigation

**Tab order:**

1. Applied Filters section (if visible)
   - Each filter chip (Tab to focus, Enter/Space to remove)
   - "Clear all" link
2. Each filter section summary (Enter/Space to expand/collapse)
3. Within expanded section:
   - Each checkbox item (Space to toggle)
   - "Show more/less" link (Enter to activate)
   - "Clear" link (Enter to clear section)

**Screen readers:**

- Announce section name when focusing summary
- Announce checkbox state (checked/unchecked) and label + count
- Announce selection count in summary ("3 selected")
- Announce "Show more/less" state and item count
- Announce when filters are applied/cleared

### ARIA Attributes

**Details/Summary:**

- Native `<details>` and `<summary>` provide built-in ARIA
- Add `aria-expanded` for clarity (redundant but explicit)

**Checkboxes:**

- Use native `<input type="checkbox">` with `<label>`
- `id` and `for` attributes properly linked
- Group in `<fieldset>` with `<legend>` for section name

**Applied Filters:**

- Each chip has `role="button"` for remove action
- `aria-label="Remove [filter name]"`

**Show More:**

- `aria-expanded` attribute (true when showing all)
- `aria-controls` pointing to checkbox list container
- `aria-live="polite"` for count updates

---

## Visual Styling (Tailwind)

### Applied Filters Section

```css
/* Container */
bg-stripe rounded-sm p-4 mb-4 border border-default

/* Heading */
text-sm font-medium text-subtle mb-2

/* Filter chip */
inline-flex items-center gap-2 bg-canvas rounded-sm px-3 py-1.5
text-sm text-default border border-default

/* Remove button */
text-subtle hover:text-accent focus:text-accent

/* Clear all link */
text-sm text-accent hover:underline focus:underline
```

### Filter Section

```css
/* Details element */
border-b border-default last:border-0

/* Summary - triangle on RIGHT */
flex items-center justify-between py-3 px-4 cursor-pointer
hover:bg-stripe focus:bg-stripe

/* Section title - LEFT aligned */
flex items-center gap-2 text-base font-medium text-default

/* Disclosure triangle - RIGHT aligned, points down when open, up when closed */
ml-auto size-3 transition-transform [[open]>&]:rotate-180

/* Clear link */
text-sm text-accent hover:underline focus:underline

/* Checkbox container */
px-4 pb-3

/* Checkbox item */
flex items-center gap-3 py-2 cursor-pointer rounded-sm
hover:bg-stripe focus-within:bg-stripe

/* Checkbox input (native, styled) */
size-4 cursor-pointer accent-[color-accent]

/* Label */
flex-1 text-sm text-default cursor-pointer

/* Count */
text-sm text-subtle
```

### Show More

```css
/* Link */
text-sm text-accent hover:underline focus:underline pt-2 pb-2
```

### Clear Link (per section)

```css
/* Link (beneath options) */
text-sm text-accent hover:underline focus:underline pt-3 pb-2
```

---

## Component Architecture

### New Components

1. **`CheckboxListField.tsx`** (replaces MultiSelectField AND SelectField)
   - Props: `label`, `options`, `defaultValues`, `onChange`, `showMoreThreshold`, `onClear`
   - Handles: checkbox list, show more (no "show less"), selection ordering, clear link beneath
   - No dropdown, all items inline
   - Counts update dynamically
   - **Used for ALL filters** (genres, medium, venue, reviewed status, credited as, credits, collections)

2. **`RadioListField.tsx`** (DEPRECATED - not needed)
   - Originally created for single-select filters
   - Orbit DVD uses checkboxes for all filters, allowing multiple selection
   - This component should be removed after all conversions to CheckboxListField

3. **`FilterSection.tsx`** (wrapper for details/summary)
   - Props: `title`, `children`, `defaultOpen`, `selectionCount`
   - Handles: collapsible section (no clear in summary - that's in field components)

4. **`AppliedFilters.tsx`** (new)
   - Props: `filters`, `onRemove`, `onClearAll`
   - Handles: chip list (including search chips), individual/bulk removal

5. **`RangeSliderField.tsx`** (new)
   - Props: `label`, `min`, `max`, `fromValue`, `toValue`, `onChange`, `onClear`
   - Handles: dual-handle range slider, syncs with dropdowns, clear link beneath

### Modified Components

1. **`FilterAndSortContainer.tsx`**
   - Add AppliedFilters component at top
   - Pass active filters to AppliedFilters
   - Handle chip removal callbacks

2. **All `*Filters.tsx` components** (7 files)
   - Replace MultiSelectField → CheckboxListField
   - Replace SelectField → CheckboxListField (allow multiple selection for all filters)
   - Wrap each filter in FilterSection (all sections open by default, triangle on right)
   - Calculate **dynamic counts** for each option (updates when other filters change)
   - **REQUIRED:** Add RangeSliderField beneath YearField/GradeField (must be integrated)
   - Add text search to Applied Filters
   - Clear links moved inside field components (beneath options)
   - Applied filter chips show value only (not "Category: Value")

### Enhanced Components

- `TextField.tsx` - text search unchanged, but now adds chip to AppliedFilters
- `YearField.tsx` - keep dual dropdowns, add RangeSliderField beneath
- `GradeField.tsx` - keep dual dropdowns, add RangeSliderField beneath

### Unchanged Components

- `FilterAndSortHeader.tsx` - no changes needed

---

## Data Requirements

### Option Counts

Each filter option needs a count of matching items. For example:

```typescript
{
  label: "Horror",
  value: "horror",
  count: 156  // ← NEW: number of items matching this filter
}
```

**Calculation strategy:**
**Dynamic counts** (at runtime): Count items matching current filter state

- Calculate counts based on currently applied filters
- When user selects Genre "Horror", all other filter counts update to show only items that are ALSO Horror
- This gives user immediate feedback on how many results each combination will yield
- Matches Orbit DVD behavior

**Implementation:** Add count calculation to each feature's filter functions:

- `filteredReviews.ts` → add `calculateGenreCounts()` helper
- `filteredWatchlist.ts` → add `calculateDirectorCounts()` helper
- etc.

### Range Filter Chips

**CRITICAL:** Range filters (Year, Grade) should NOT display chips when set to full/default range.

- Year ranges and grade ranges have dynamic min/max values that vary by page
- Applied filter chip builders must check if current range equals full available range before creating chips
- Only create chips when range is partially restricted (not showing all available values)
- Example: If available years are 1920-2024 and user has selected 1920-2024, do NOT show chip
- Example: If user has selected 1980-1989, DO show chip as "Release Year: 1980-1989"

**Implementation:**

- Pass available years/grades context to `buildAppliedFilterChips()` functions
- Add full-range checks before creating year/grade chips
- See grade filter for correct pattern (already has full-range check)

---

## Migration Strategy

### Phase 1: Core Infrastructure

1. Create new components (CheckboxListField, RadioListField, FilterSection, AppliedFilters)
2. Implement count calculation for one feature (e.g., Reviews)
3. Convert one filter category to checkbox (e.g., Genres in Reviews)
4. Test accessibility, keyboard nav, screen readers

### Phase 2: All Multi-Select Filters

1. Convert all remaining MultiSelectField usages to CheckboxListField
2. Add counts for all filter options across all features
3. Test all 7 pages

### Phase 3: Single-Select Filters

1. Convert ReviewedStatusFilter to RadioListField
2. Convert CreditedAsFilter to RadioListField
3. Convert any other single-select dropdowns

### Phase 4: Polish

1. Add animations (chips fade in/out, sections expand/collapse)
2. Optimize performance (virtualization if needed for very long lists)
3. A/B test "Show more" threshold (3 vs 5 vs 7)
4. Add range sliders for Year/Grade (optional)

---

## Decisions Made

1. **"Show more" threshold:** 3 items (matching Orbit DVD pattern)
2. **Sort order for unselected items:** Alphabetical (matching Orbit DVD)
3. **Dynamic counts:** Yes - update when other filters change (matching Orbit DVD)
4. **Default section state:** All sections open by default (matching Orbit DVD for better discoverability)
5. **Range filters:** Dual dropdowns + sliders beneath (both usable)
6. **Text search chip:** Yes - show "Search: [query]" in applied filters
7. **Clear link position:** Beneath filter options, not in summary header (matching Orbit DVD)
8. **Show less:** Omit - users can collapse the section instead (matching Orbit DVD)
9. **Animations:** Subtle fade/slide (Phase 7)
10. **Remember section state:** No - reset on page load (can revisit later)
11. **Filter selection model:** All filters allow multiple selection (checkboxes) - no single-select filters
12. **Disclosure triangle position:** Far right side of summary bar (matching Orbit DVD)
13. **Applied filter chips:** Show value only for simple filters, "Category: Value" for ranges

---

## Success Metrics

### Usability

- Time to apply filters decreases (no dropdown clicks needed)
- Fewer abandoned filter operations
- Increased use of multi-select filters

### Accessibility

- All WCAG 2.1 AA criteria met
- Full keyboard navigation works
- Screen reader testing passes

### Performance

- No perceptible lag when checking/unchecking items
- Smooth animations (60fps)
- Fast initial render (< 100ms)

### Visual

- Matches design system (Tailwind theme)
- Responsive on all breakpoints
- Clear visual hierarchy

---

## Critical Implementation Requirements

These requirements MUST be verified during implementation to prevent drift:

### Visual Text Strings

- [ ] "Show more" button text is EXACTLY "+ Show more" (no count, no variation)
- [ ] No "(n selected)" text appears anywhere in filter UI
- [ ] Applied filter chips use format: "Category: Value" or just "Value" when category equals value
- [ ] "Clear all" link text is EXACTLY "Clear all"

### Interaction Timing

- [ ] AppliedFilters updates in real-time as checkboxes are checked/unchecked (before clicking "View Results")
- [ ] Checking a box immediately shows chip in AppliedFilters section
- [ ] Unchecking a box immediately removes chip from AppliedFilters section
- [ ] Clicking × on chip immediately unchecks corresponding checkbox
- [ ] "Clear all" immediately unchecks all checkboxes and removes all chips

### Filter Section Behavior

- [ ] "Show more" expands list and changes to inline display (no separate "Show less" button)
- [ ] Collapsing section via summary resets to showing first 3 items
- [ ] Selected items always appear at top (newest selection first)
- [ ] Unselected items always alphabetical (A-Z)
- [ ] Clear link appears beneath checkboxes only when selections exist

### Visual Hierarchy

- [ ] AppliedFilters section appears at very top of drawer (before all filter sections)
- [ ] AppliedFilters has distinct background color (bg-stripe) to stand out
- [ ] Filter sections use native details/summary with disclosure triangle
- [ ] Counts appear in parentheses after each option label

---

## References

- Current implementation: `/src/components/fields/MultiSelectField.tsx`
- Filter architecture: See codebase exploration report (from Task agent)
- Similar patterns: Orbit DVD, Amazon filters, Shopify collection filters
- Accessibility: [W3C ARIA Authoring Practices - Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- Design inspiration: [Filter UI Best Practices](https://www.aufaitux.com/blog/filter-ui-design/), [Applied Filters UX](https://baymard.com/blog/how-to-design-applied-filters)

---

**Version:** 1.0
**Last Updated:** 2026-02-07
**Status:** Draft - Pending Review
