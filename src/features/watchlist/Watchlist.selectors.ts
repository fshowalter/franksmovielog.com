import {
  createSelectSortedTitles,
  type TitleSort,
} from "~/components/filter-and-sort/createSelectSortedTitles";

import type { WatchlistValue } from "./WatchlistListItem";

export type WatchlistSort = TitleSort;

export const selectSortedWatchlistValues = createSelectSortedTitles<
  WatchlistValue,
  WatchlistSort
>();

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

/**
 * Build group values helper - groups items by a key function
 */

export function selectFilteredWatchlistValues(
  filterValues: WatchlistFiltersValues,
  sortedValues: WatchlistValue[],
) {
  const filters = [
    createGenresFilter(filterValues.genres),
    createReleaseYearFilter(filterValues.releaseYear),
    createTitleFilter(filterValues.title),
  ].filter((filterFn) => filterFn !== undefined);

  console.log(filters);

  return filterSortedValues({ filters, sortedValues });
}

export function selectGroupedValues(
  filteredValues: WatchlistValue[],
  showCount: number,
  sort: WatchlistSort,
) {
  console.log("selectGroupedValues");
  const paginatedItems = filteredValues.slice(0, showCount);
  return groupValues(paginatedItems, sort);
}

export function selectHasActiveFilters(
  pendingFilterValues: WatchlistFiltersValues,
): boolean {
  console.log("selectHasActiveFilters");
  return Object.keys(pendingFilterValues).length > 0;
}

/**
 * Create a Genre filter function
 */
function createGenresFilter(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: WatchlistValue) => {
    return filterValue.every((genre) => value.genres.includes(genre));
  };
}

/**
 * Create a Release Year filter function
 */
function createReleaseYearFilter(filterValue?: [string, string]) {
  if (!filterValue) return;
  return (value: WatchlistValue): boolean => {
    return (
      value.releaseYear >= filterValue[0] && value.releaseYear <= filterValue[1]
    );
  };
}

/**
 * Create a Title filter function
 */
function createTitleFilter(filterValue?: string) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: WatchlistValue): boolean => regex.test(value.title);
}

// Filter values helper
function filterSortedValues({
  filters,
  sortedValues,
}: {
  filters: ((value: WatchlistValue) => boolean)[];
  sortedValues: readonly WatchlistValue[];
}): WatchlistValue[] {
  return sortedValues.filter((value) => {
    return filters.every((filter) => {
      return filter(value);
    });
  });
}

/**
 * Gets the group letter for a given string, typically used for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 *
 * @param str - The string to get the group letter from
 * @returns The uppercase first letter or "#" for non-alphabetic characters
 */
function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

function groupForWatchlistValue(
  value: WatchlistValue,
  sort: WatchlistSort,
): string {
  switch (sort) {
    case "release-date-asc":
    case "release-date-desc": {
      return value.releaseYear;
    }
    case "title-asc":
    case "title-desc": {
      return getGroupLetter(value.sortTitle);
    }
  }
}

function groupValues(
  sortedValues: WatchlistValue[],
  sort: WatchlistSort,
): Map<string, WatchlistValue[]> {
  const grouped = new Map<string, WatchlistValue[]>();

  for (const value of sortedValues) {
    const key = groupForWatchlistValue(value, sort);
    const group = grouped.get(key) || [];
    group.push(value);
    grouped.set(key, group);
  }

  return grouped;
}
