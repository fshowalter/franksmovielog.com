import type { TitleFiltersValues } from "~/reducers/titleFiltersReducer";

import { createReleaseYearFilter } from "./createReleaseYearFilter";
import { createTitleFilter } from "./createTitleFilter";
import { filterSortedValues } from "./filterSortedValues";

export type FilterableTitle = {
  genres: string[];
  releaseYear: string;
  title: string;
};

/**
 * Filters an array of titles based on multiple filter criteria.
 * @param filterValues - Object containing filter values for genres, release year, and title
 * @param sortedValues - Array of titles to filter
 * @param extraFilters - Additional custom filter functions to apply
 * @returns Filtered array of titles matching all filter criteria
 */
export function filterTitles<TValue extends FilterableTitle>(
  filterValues: TitleFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createGenresFilter(filterValues.genres),
    createReleaseYearFilter(filterValues.releaseYear),
    createTitleFilter(filterValues.title),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterSortedValues({ filters, sortedValues });
}

/**
 * Create a Genre filter function
 */
function createGenresFilter<TValue extends FilterableTitle>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => {
    return filterValue.every((genre) => value.genres.includes(genre));
  };
}
