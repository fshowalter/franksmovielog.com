/**
 * Reducer utilities for collection-based lists (groups of items).
 * Used by Collections and CastAndCrew components.
 */

import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

import { updatePendingFilter } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import { sortNumber, sortString } from "~/utils/reducerUtils";

// ============================================================================
// Collection-specific Action Types
// ============================================================================

/**
 * Collection-specific filter actions
 */
export enum CollectionsActions {
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
}

// Union type for all collection-specific actions
export type CollectionsActionType<TSortValue = unknown> =
  | ListWithFiltersActionType<TSortValue>
  | PendingFilterNameAction;

export type PendingFilterNameAction = {
  type: CollectionsActions.PENDING_FILTER_NAME;
  value: string;
};

// ============================================================================
// Collection-specific Filter Handlers
// ============================================================================

/**
 * Handle Name filter action for collections
 */
export function handleNameFilterAction<
  TItem extends { name: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterNameAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createNameFilter(action.value);
  const baseState = updatePendingFilter(state, "name", filterFn, action.value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

// ============================================================================
// Collection-specific Sort Functions
// ============================================================================

export function sortName<T extends { name: string }>() {
  return {
    "name-asc": (a: T, b: T) => sortString(a.name, b.name),
    "name-desc": (a: T, b: T) => sortString(a.name, b.name) * -1,
  };
}

export function sortReviewCount<T extends { reviewCount: number }>() {
  return {
    "review-count-asc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
  };
}

// ============================================================================
// Private Filter Creation Functions
// ============================================================================

function createNameFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { name: string }>(item: T) => regex.test(item.name);
}
