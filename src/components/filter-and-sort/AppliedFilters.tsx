import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";

/**
 * AppliedFilters component displays active filters as removable chips
 * with a "Clear all" option. Hidden when no filters are active.
 *
 * Features:
 * - Individual chip removal via × button
 * - "Clear all" link to remove all filters
 * - Full keyboard support (Tab to chip, Enter/Space to remove)
 * - Proper ARIA attributes for accessibility
 * - Automatically hidden when filters array is empty
 */

export type FilterChip = {
  // AIDEV-NOTE: displayText is pre-assembled by chip builders (e.g. "Grade: A- to B+",
  // "Search: alien", "Horror"). No rendering logic needed here.
  displayText: string;
  key: string; // Unique id used for removal dispatch (e.g. "genre-horror", "gradeValue")
  value?: string; // Raw filter value for multi-select chips (e.g. "Horror")
};

type AppliedFiltersProps = {
  filters: FilterChip[];
  onClearAll: () => void;
  onRemove: (key: string) => void;
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
    <AnimatedDetailsDisclosure title="Applied Filters">
      <div className="mb-3 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            aria-label={`Remove ${filter.displayText} filter`}
            className="
              inline-flex items-center gap-2 rounded-sm border border-default
              bg-canvas px-3 py-1.5 font-sans text-sm text-default
              transition-colors
              hover:border-accent hover:bg-accent
              focus:border-accent focus:bg-accent focus:outline-none
            "
            key={filter.key}
            onClick={() => onRemove(filter.key)}
            type="button"
          >
            <span>{filter.displayText}</span>
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>

      <button
        className="font-sans text-sm text-accent underline"
        onClick={onClearAll}
        type="button"
      >
        Clear all
      </button>
    </AnimatedDetailsDisclosure>
  );
}
