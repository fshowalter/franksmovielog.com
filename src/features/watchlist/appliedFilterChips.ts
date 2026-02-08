import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Watchlist page.
 *
 * Converts the structured filter values (genres, releaseYear, title, director, performer, writer, collection)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @returns Array of FilterChip objects representing active filters
 *
 * @example
 * ```ts
 * buildAppliedFilterChips({
 *   genres: ["Horror", "Action"],
 *   releaseYear: ["1980", "1989"],
 *   director: "Christopher Nolan",
 *   title: "dark knight"
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
  if (filterValues.releaseYear && filterValues.releaseYear.length > 0) {
    const years = filterValues.releaseYear;
    const minYear = years[0];
    const maxYear = years[years.length - 1];
    chips.push({
      category: "Release Year",
      id: "releaseYear",
      label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
    });
  }

  // Director chip (single-select)
  if (filterValues.director) {
    chips.push({
      category: "Director",
      id: "director",
      label: filterValues.director,
    });
  }

  // Performer chip (single-select)
  if (filterValues.performer) {
    chips.push({
      category: "Performer",
      id: "performer",
      label: filterValues.performer,
    });
  }

  // Writer chip (single-select)
  if (filterValues.writer) {
    chips.push({
      category: "Writer",
      id: "writer",
      label: filterValues.writer,
    });
  }

  // Collection chip (single-select)
  if (filterValues.collection) {
    chips.push({
      category: "Collection",
      id: "collection",
      label: filterValues.collection,
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
