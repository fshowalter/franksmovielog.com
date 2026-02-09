import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { ViewingsFiltersValues } from "./Viewings.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Viewings page.
 *
 * Converts the structured filter values (releaseYear, reviewedStatus, viewingYear, medium, venue, title)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @returns Array of FilterChip objects representing active filters
 *
 * @example
 * ```ts
 * buildAppliedFilterChips({
 *   releaseYear: ["1980", "1989"],
 *   reviewedStatus: "Reviewed",
 *   medium: "Blu-ray",
 *   venue: "Home",
 *   title: "alien"
 * })
 * // Returns:
 * // [
 * //   { id: "releaseYear", category: "Release Year", label: "1980-1989" },
 * //   { id: "reviewedStatus", category: "Reviewed Status", label: "Reviewed" },
 * //   { id: "medium", category: "Medium", label: "Blu-ray" },
 * //   { id: "venue", category: "Venue", label: "Home" },
 * //   { id: "title", category: "Search", label: "alien" }
 * // ]
 * ```
 */
export function buildAppliedFilterChips(
  filterValues: ViewingsFiltersValues,
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Release Year chip (range)
  if (filterValues.releaseYear && filterValues.releaseYear.length > 0) {
    const years = filterValues.releaseYear;
    const minYear = years[0];
    const maxYear = years.at(-1);
    chips.push({
      category: "Release Year",
      id: "releaseYear",
      label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
    });
  }

  // Reviewed Status chip (single-select, exclude "All")
  if (
    filterValues.reviewedStatus &&
    filterValues.reviewedStatus !== "All"
  ) {
    chips.push({
      category: "Reviewed Status",
      id: "reviewedStatus",
      label: filterValues.reviewedStatus,
    });
  }

  // Viewing Year chip (range)
  if (filterValues.viewingYear && filterValues.viewingYear.length > 0) {
    const [minYear, maxYear] = filterValues.viewingYear;
    chips.push({
      category: "Viewing Year",
      id: "viewingYear",
      label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
    });
  }

  // Medium chip (single-select, exclude "All")
  if (filterValues.medium && filterValues.medium !== "All") {
    chips.push({
      category: "Medium",
      id: "medium",
      label: filterValues.medium,
    });
  }

  // Venue chip (single-select, exclude "All")
  if (filterValues.venue && filterValues.venue !== "All") {
    chips.push({
      category: "Venue",
      id: "venue",
      label: filterValues.venue,
    });
  }

  // Title search chip
  if (filterValues.title && filterValues.title.trim() !== "") {
    chips.push({
      category: "Search",
      id: "title",
      label: filterValues.title,
    });
  }

  return chips;
}
