/**
 * Reducer utilities for title-based lists (movies/films).
 * Used by Reviews, CastAndCrewMember, Viewings, Watchlist, and Collection components.
 */

import type { ListWithFiltersState } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type { GroupFn } from "~/components/utils/reducerUtils";

import { updatePendingFilter } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  getGroupLetter,
  sortNumber,
  sortString,
} from "~/components/utils/reducerUtils";

/**
 * Type for title filter values with known keys
 */
export type TitleFilterValues = {
  genre?: readonly string[];
  grade?: [number, number];
  releaseYear?: [string, string];
  reviewedStatus?: string;
  reviewYear?: [string, string];
  title?: string;
};

/**
 * Default number of items to show per page for paginated lists
 */
export const SHOW_COUNT_DEFAULT = 100;

/**
 * Title-specific filter actions
 */
export enum TitlesActions {
  PENDING_FILTER_GENRES = "PENDING_FILTER_GENRES",
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_REVIEWED_STATUS = "PENDING_FILTER_REVIEWED_STATUS",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
}

// Union type for all title-specific actions
export type TitlesActionType =
  | PendingFilterGenresAction
  | PendingFilterGradeAction
  | PendingFilterReleaseYearAction
  | PendingFilterReviewedStatusAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | ShowMoreAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type TitlesListState<TItem, TSortValue> = Omit<
  ListWithFiltersState<TItem, TSortValue>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: TitleFilterValues;
  pendingFilterValues: TitleFilterValues;
};

// ============================================================================
// Title-specific Action Types
// ============================================================================

/**
 * Common sort types for title-based lists
 */
export type TitleSortType =
  | "grade-asc"
  | "grade-desc"
  | "release-date-asc"
  | "release-date-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc";

/**
 * Base type for items that can be grouped by common title sorts
 */
type GroupableTitleItem = {
  grade?: string;
  releaseYear: string;
  reviewMonth?: string;
  reviewYear?: string;
  sortTitle: string;
};

type PendingFilterGenresAction = {
  type: TitlesActions.PENDING_FILTER_GENRES;
  values: string[];
};

type PendingFilterGradeAction = {
  type: TitlesActions.PENDING_FILTER_GRADE;
  values: [number, number];
};

type PendingFilterReleaseYearAction = {
  type: TitlesActions.PENDING_FILTER_RELEASE_YEAR;
  values: [string, string];
};

type PendingFilterReviewedStatusAction = {
  type: TitlesActions.PENDING_FILTER_REVIEWED_STATUS;
  value: string;
};

type PendingFilterReviewYearAction = {
  type: TitlesActions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

// ============================================================================
// Title-specific Filter Handlers
// ============================================================================

type PendingFilterTitleAction = {
  type: TitlesActions.PENDING_FILTER_TITLE;
  value: string;
};

type ShowMoreAction = {
  increment?: number;
  type: TitlesActions.SHOW_MORE;
};

/**
 * Creates a pagination-aware group function that slices items before grouping
 */
export function createPaginatedGroupFn<TItem, TSortValue>(
  baseGroupFn: GroupFn<TItem, TSortValue>,
  showCount: number,
): GroupFn<TItem, TSortValue> | undefined {
  return (items: TItem[], sortValue: TSortValue) => {
    const paginatedItems = items.slice(0, showCount);
    return baseGroupFn(paginatedItems, sortValue);
  };
}

/**
 * Creates a generic groupForValue function for title-based lists
 */
export function createTitleGroupForValue<
  T extends GroupableTitleItem,
  TSortValue extends TitleSortType,
>(): (value: T, sortValue: TSortValue) => string {
  return (value: T, sortValue: TSortValue): string => {
    switch (sortValue) {
      case "grade-asc":
      case "grade-desc": {
        return value.grade || "Unreviewed";
      }
      case "release-date-asc":
      case "release-date-desc": {
        return value.releaseYear;
      }
      case "review-date-asc":
      case "review-date-desc": {
        if (!value.reviewYear) {
          return "Unreviewed";
        }
        if (value.reviewMonth) {
          return `${value.reviewMonth} ${value.reviewYear}`;
        }
        return value.reviewYear;
      }
      case "title-asc":
      case "title-desc": {
        return getGroupLetter(value.sortTitle);
      }
    }
  };
}

/**
 * Handle Genre filter action for titles
 */
export function handleGenreFilterAction<
  TItem extends { genres: string[] },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterGenresAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createGenresFilter(action.values);
  const filterKey: keyof TitleFilterValues = "genre";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle Grade filter action for titles
 */
export function handleGradeFilterAction<
  TItem extends { gradeValue: number | undefined },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterGradeAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createGradeFilter(action.values[0], action.values[1]);
  const filterKey: keyof TitleFilterValues = "grade";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );

  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

// ============================================================================
// Title-specific Sort Functions
// ============================================================================

/**
 * Handle Release Year filter action for titles
 */
export function handleReleaseYearFilterAction<
  TItem extends { releaseYear: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterReleaseYearAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReleaseYearFilter(action.values[0], action.values[1]);
  const filterKey: keyof TitleFilterValues = "releaseYear";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle Review Status filter action for titles
 */
export function handleReviewedStatusFilterAction<
  TItem extends { slug: string | undefined },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterReviewedStatusAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReviewStatusFilter(action.value);
  const filterKey: keyof TitleFilterValues = "reviewedStatus";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.value,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle Review Year filter action for titles
 */
export function handleReviewYearFilterAction<
  TItem extends { reviewYear?: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterReviewYearAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReviewYearFilter(action.values[0], action.values[1]);
  const filterKey: keyof TitleFilterValues = "reviewYear";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle "Show More" action for title lists with pagination
 */
export function handleShowMoreAction<
  TItem,
  TSortValue,
  TExtendedState extends { showCount: number },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: ShowMoreAction,
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const increment = action.increment ?? SHOW_COUNT_DEFAULT;
  return showMore(state, increment, groupFn);
}

/**
 * Handle Title filter action for titles
 */
export function handleTitleFilterAction<
  TItem extends { title: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterTitleAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createTitleFilter(action.value);
  const filterKey: keyof TitleFilterValues = "title";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.value,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

// ============================================================================
// Private Filter Creation Functions
// ============================================================================

export function sortGrade<T extends { gradeValue?: null | number }>() {
  return {
    "grade-asc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0),
    "grade-desc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0) * -1,
  };
}

export function sortReleaseDate<T extends { releaseSequence: string }>() {
  return {
    "release-date-asc": (a: T, b: T) =>
      sortString(a.releaseSequence, b.releaseSequence),
    "release-date-desc": (a: T, b: T) =>
      sortString(a.releaseSequence, b.releaseSequence) * -1,
  };
}

export function sortReviewDate<T extends { reviewSequence?: null | string }>() {
  return {
    "review-date-asc": (a: T, b: T) =>
      sortString(a.reviewSequence || "", b.reviewSequence || ""),
    "review-date-desc": (a: T, b: T) =>
      sortString(a.reviewSequence || "", b.reviewSequence || "") * -1,
  };
}

export function sortTitle<T extends { sortTitle: string }>() {
  return {
    "title-asc": (a: T, b: T) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: T, b: T) => sortString(a.sortTitle, b.sortTitle) * -1,
  };
}

function createGenresFilter(genres: readonly string[]) {
  if (genres.length === 0) return;
  return <T extends { genres: readonly string[] }>(item: T) => {
    return genres.every((genre) => item.genres.includes(genre));
  };
}

function createGradeFilter(minGradeValue: number, maxGradeValue: number) {
  return <T extends { gradeValue: number | undefined }>(item: T) => {
    if (!item.gradeValue) {
      return false;
    }
    return item.gradeValue >= minGradeValue && item.gradeValue <= maxGradeValue;
  };
}

// ============================================================================
// Title-specific State Types
// ============================================================================

function createReleaseYearFilter(minYear: string, maxYear: string) {
  return <T extends { releaseYear: string }>(item: T) => {
    return item.releaseYear >= minYear && item.releaseYear <= maxYear;
  };
}

// ============================================================================
// Show More Handling
// ============================================================================

function createReviewStatusFilter(status: string) {
  return <T extends { slug: string | undefined }>(item: T): boolean => {
    if (status === "All") {
      return true;
    }

    if (status === "Reviewed") {
      return !!item.slug;
    }

    return !item.slug;
  };
}

function createReviewYearFilter(minYear: string, maxYear: string) {
  return <T extends { reviewYear?: string }>(item: T) => {
    const year = item.reviewYear;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  };
}

// ============================================================================
// Generic Group Function Builder
// ============================================================================

function createTitleFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { title: string }>(item: T) => regex.test(item.title);
}

/**
 * Handle "Show More" pagination for title lists
 */
function showMore<
  TItem,
  TSortValue,
  TExtendedState extends { showCount: number },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  increment: number,
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn(
    state.filteredValues.slice(0, showCount),
    state.sortValue,
  );

  return {
    ...state,
    groupedValues,
    showCount,
  };
}
