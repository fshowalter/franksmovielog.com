import type { TitleFiltersValues } from "~/reducers/titleFiltersReducer";

import { filterSortedValues } from "./filterSortedValues";

export type FilterableTitle = {
  genres: string[];
  releaseYear: string;
  title: string;
};

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

/**
 * Create a Release Year filter function
 */
function createReleaseYearFilter<TValue extends FilterableTitle>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.releaseYear >= filterValue[0] && value.releaseYear <= filterValue[1]
    );
  };
}

/**
 * Create a Title filter function
 */
function createTitleFilter<TValue extends FilterableTitle>(
  filterValue?: string,
) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.title);
}
