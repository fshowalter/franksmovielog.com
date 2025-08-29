/**
 * Reducer utilities for title-based lists (movies/films).
 * Used by Reviews, CastAndCrewMember, Viewings, Watchlist, and Collection components.
 */

import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type { GroupFn } from "~/components/utils/reducerUtils";

import { updatePendingFilter } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import { sortNumber, sortString } from "~/components/utils/reducerUtils";

/**
 * Default number of items to show per page for paginated lists
 */
export const SHOW_COUNT_DEFAULT = 100;

// ============================================================================
// Title-specific Action Types
// ============================================================================

/**
 * Title-specific filter actions
 */
export enum TitlesActions {
  PENDING_FILTER_GENRES = "PENDING_FILTER_GENRES",
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
  PENDING_FILTER_RELEASE_YEAR = "PENDING_FILTER_RELEASE_YEAR",
  PENDING_FILTER_REVIEW_STATUS = "PENDING_FILTER_REVIEW_STATUS",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
}

// Union type for all title-specific actions
export type TitlesActionType<TSortValue = unknown> =
  | ListWithFiltersActionType<TSortValue>
  | PendingFilterGenresAction
  | PendingFilterGradeAction
  | PendingFilterReleaseYearAction
  | PendingFilterReviewStatusAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | ShowMoreAction;

type PendingFilterGenresAction = {
  type: TitlesActions.PENDING_FILTER_GENRES;
  values: readonly string[];
};

type PendingFilterGradeAction = {
  type: TitlesActions.PENDING_FILTER_GRADE;
  values: [number, number];
};

type PendingFilterReleaseYearAction = {
  type: TitlesActions.PENDING_FILTER_RELEASE_YEAR;
  values: [string, string];
};

type PendingFilterReviewStatusAction = {
  type: TitlesActions.PENDING_FILTER_REVIEW_STATUS;
  value: string;
};

type PendingFilterReviewYearAction = {
  type: TitlesActions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: TitlesActions.PENDING_FILTER_TITLE;
  value: string;
};

// ============================================================================
// Title-specific Filter Handlers
// ============================================================================

type ShowMoreAction = {
  increment?: number;
  type: TitlesActions.SHOW_MORE;
};

/**
 * Creates a pagination-aware group function that slices items before grouping
 */
export function createPaginatedGroupFn<TItem, TSortValue>(
  baseGroupFn: GroupFn<TItem, TSortValue> | undefined,
  showCount: number,
): GroupFn<TItem, TSortValue> | undefined {
  if (!baseGroupFn) return undefined;

  return (items: TItem[], sortValue: TSortValue) => {
    const paginatedItems = items.slice(0, showCount);
    return baseGroupFn(paginatedItems, sortValue);
  };
}

/**
 * Handle Genre filter action for titles
 */
export function handleGenreFilterAction<
  TItem extends { genres: readonly string[] },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterGenresAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createGenresFilter(action.values);
  const baseState = updatePendingFilter(
    state,
    "genres",
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
  const baseState = updatePendingFilter(
    state,
    "grade",
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

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
  const baseState = updatePendingFilter(
    state,
    "releaseYear",
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
export function handleReviewStatusFilterAction<
  TItem extends { slug: string | undefined },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterReviewStatusAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReviewStatusFilter(action.value);
  const baseState = updatePendingFilter(
    state,
    "reviewStatus",
    filterFn,
    action.value,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

// ============================================================================
// Title-specific Sort Functions
// ============================================================================

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
  const baseState = updatePendingFilter(
    state,
    "reviewYear",
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
export function handleShowMore<
  TItem,
  TSortValue,
  TExtendedState extends { showCount: number },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: ShowMoreAction,
  groupFn?: GroupFn<TItem, TSortValue>,
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
  const baseState = updatePendingFilter(state, "title", filterFn, action.value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

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

// ============================================================================
// Private Filter Creation Functions
// ============================================================================

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

function createReleaseYearFilter(minYear: string, maxYear: string) {
  return <T extends { releaseYear: string }>(item: T) => {
    return item.releaseYear >= minYear && item.releaseYear <= maxYear;
  };
}

function createReviewStatusFilter(status: string) {
  return <T extends { slug: string | undefined }>(item: T): boolean => {
    if (status == "All") {
      return true;
    }

    if (status == "Reviewed") {
      return !!item.slug;
    }

    return !item.slug;
  };
}

// ============================================================================
// Title-specific State Types
// ============================================================================

function createReviewYearFilter(minYear: string, maxYear: string) {
  return <T extends { reviewYear?: string }>(item: T) => {
    const year = item.reviewYear;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  };
}

// ============================================================================
// Show More Handling
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
  groupFn?: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn
    ? groupFn(state.filteredValues.slice(0, showCount), state.sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    groupedValues,
    showCount,
  };
}
