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
 *   medium: ["Blu-ray", "4K UHD"],
 *   venue: ["Home", "Theater"],
 *   title: "alien"
 * })
 * // Returns:
 * // [
 * //   { id: "releaseYear", category: "Release Year", label: "1980-1989" },
 * //   { id: "reviewedStatus", category: "Reviewed Status", label: "Reviewed" },
 * //   { id: "medium-blu-ray", category: "Medium", label: "Blu-ray" },
 * //   { id: "medium-4k-uhd", category: "Medium", label: "4K UHD" },
 * //   { id: "venue-home", category: "Venue", label: "Home" },
 * //   { id: "venue-theater", category: "Venue", label: "Theater" },
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

  // Reviewed Status chips (multi-select, one chip per status)
  if (filterValues.reviewedStatus && filterValues.reviewedStatus.length > 0) {
    for (const status of filterValues.reviewedStatus) {
      chips.push({
        category: "Reviewed Status",
        id: `reviewedStatus-${status.toLowerCase().replaceAll(" ", "-")}`,
        label: status,
      });
    }
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

  // Medium chips (multi-select, one chip per medium)
  if (filterValues.medium && filterValues.medium.length > 0) {
    for (const medium of filterValues.medium) {
      chips.push({
        category: "Medium",
        id: `medium-${medium.toLowerCase().replaceAll(" ", "-")}`,
        label: medium,
      });
    }
  }

  // Venue chips (multi-select, one chip per venue)
  if (filterValues.venue && filterValues.venue.length > 0) {
    for (const venue of filterValues.venue) {
      chips.push({
        category: "Venue",
        id: `venue-${venue.toLowerCase().replaceAll(" ", "-")}`,
        label: venue,
      });
    }
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
