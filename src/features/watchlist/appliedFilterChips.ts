import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Watchlist page.
 *
 * Converts the structured filter values (genres, releaseYear, title, director, performer, writer, collection)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @param context - Optional context with available years for full-range checks
 * @param context.distinctReleaseYears - Available release years
 * @returns Array of FilterChip objects representing active filters
 *
 * @example
 * ```ts
 * buildAppliedFilterChips({
 *   genres: ["Horror", "Action"],
 *   releaseYear: ["1980", "1989"],
 *   director: "Christopher Nolan",
 *   title: "dark knight"
 * }, {
 *   distinctReleaseYears: ["1920", "2024"]
 * })
 * // Returns:
 * // [
 * //   { id: "genre-horror", category: "Genre", label: "Horror" },
 * //   { id: "genre-action", category: "Genre", label: "Action" },
 * //   { id: "releaseYear", category: "Release Year", label: "1980-1989" },
 * //   { id: "director", category: "Director", label: "Christopher Nolan" },
 * //   { id: "title", category: "Search", label: "dark knight" }
 * // ]
 * ```
 */
export function buildAppliedFilterChips(
  filterValues: WatchlistFiltersValues,
  context?: {
    distinctReleaseYears?: readonly string[];
  },
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Genre chips (multi-select)
  if (filterValues.genres && filterValues.genres.length > 0) {
    for (const genre of filterValues.genres) {
      chips.push({
        category: "Genre",
        id: `genre-${genre.toLowerCase().replaceAll(" ", "-")}`,
        label: genre,
      });
    }
  }

  // Release Year chip (range)
  // AIDEV-NOTE: Only show chip if range is not full default (FILTER_REDESIGN_SPEC.md Issue 3)
  if (
    filterValues.releaseYear &&
    filterValues.releaseYear.length === 2 &&
    context?.distinctReleaseYears
  ) {
    const [minYear, maxYear] = filterValues.releaseYear;
    const availableMin = context.distinctReleaseYears[0];
    const availableMax =
      context.distinctReleaseYears.at(-1)!;

    // Only show chip if not full range
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Release Year",
        id: "releaseYear",
        label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
      });
    }
  }

  // Director chips (multi-select)
  if (filterValues.director && filterValues.director.length > 0) {
    for (const director of filterValues.director) {
      chips.push({
        category: "Director",
        id: `director-${director.toLowerCase().replaceAll(" ", "-")}`,
        label: director,
      });
    }
  }

  // Performer chips (multi-select)
  if (filterValues.performer && filterValues.performer.length > 0) {
    for (const performer of filterValues.performer) {
      chips.push({
        category: "Performer",
        id: `performer-${performer.toLowerCase().replaceAll(" ", "-")}`,
        label: performer,
      });
    }
  }

  // Writer chips (multi-select)
  if (filterValues.writer && filterValues.writer.length > 0) {
    for (const writer of filterValues.writer) {
      chips.push({
        category: "Writer",
        id: `writer-${writer.toLowerCase().replaceAll(" ", "-")}`,
        label: writer,
      });
    }
  }

  // Collection chips (multi-select)
  if (filterValues.collection && filterValues.collection.length > 0) {
    for (const collection of filterValues.collection) {
      chips.push({
        category: "Collection",
        id: `collection-${collection.toLowerCase().replaceAll(" ", "-")}`,
        label: collection,
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
