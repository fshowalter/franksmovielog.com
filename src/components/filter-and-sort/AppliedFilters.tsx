/**
 * AppliedFilters component displays active filters as removable chips
 * with a "Clear all" option. Hidden when no filters are active.
 *
 * AIDEV-NOTE: Per FILTER_REDESIGN_SPEC.md lines 25-50 and 377-395:
 * - This is NOT a collapsible FilterSection - it's a standalone section at top
 * - Has distinct bg-stripe background to stand out
 * - Heading should include colon: "Applied Filters:"
 * - Only shown when one or more filters are active
 *
 * Features:
 * - Individual chip removal via × button
 * - "Clear all" link to remove all filters
 * - Full keyboard support (Tab to chip, Enter/Space to remove)
 * - Proper ARIA attributes for accessibility
 * - Automatically hidden when filters array is empty
 */

export type FilterChip = {
  category: string; // Display category (e.g., "Genre", "Search")
  id: string; // Unique identifier (e.g., "genre-horror", "search")
  label: string; // Display value (e.g., "Horror", "alien")
};

type AppliedFiltersProps = {
  filters: FilterChip[];
  onClearAll: () => void;
  onRemove: (id: string) => void;
};

export function AppliedFilters({
  filters,
  onClearAll,
  onRemove,
}: AppliedFiltersProps): React.JSX.Element | undefined {
  // Don't render anything if no filters are active
  if (filters.length === 0) {
    return undefined;
  }

  return (
    <div className="mb-4 rounded-sm border border-default bg-stripe p-4">
      {/* Heading with colon per spec */}
      <h2 className="mb-2 font-sans text-sm font-medium text-subtle">
        Applied Filters:
      </h2>

      {/* Filter chips */}
      <div className="mb-3 flex flex-wrap gap-2">
        {filters.map((filter) => {
          // AIDEV-NOTE: Per FILTER_REDESIGN_SPEC.md line 46-47:
          // - Simple filters (Genre, Medium, Venue, etc.) show value only: "Horror"
          // - Range filters (Grade, Year) show "Category: Value": "Grade: A- to B+"
          // - Search filters show "Search: query": "Search: alien"
          const isRangeOrSearch =
            filter.category.includes("Grade") ||
            filter.category.includes("Year") ||
            filter.category === "Search";

          const displayText = isRangeOrSearch
            ? `${filter.category}: ${filter.label}`
            : filter.label;

          return (
            <button
              aria-label={`Remove ${displayText} filter`}
              className="
                inline-flex items-center gap-2 rounded-sm border border-default
                bg-canvas px-3 py-1.5 font-sans text-sm text-default
                transition-colors
                hover:border-accent hover:bg-accent
                focus:border-accent focus:bg-accent focus:outline-none
              "
              key={filter.id}
              onClick={() => onRemove(filter.id)}
              type="button"
            >
              <span>{displayText}</span>
              <span aria-hidden="true">×</span>
            </button>
          );
        })}
      </div>

      {/* Clear all link */}
      <button
        className="font-sans text-sm text-accent underline"
        onClick={onClearAll}
        type="button"
      >
        Clear all
      </button>
    </div>
  );
}
