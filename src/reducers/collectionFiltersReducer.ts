import type { FiltersAction, FiltersState } from "./filtersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "./filtersReducer";

import { createInitialFiltersState, filtersReducer } from "./filtersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type CollectionFiltersAction = FiltersAction | NameFilterChangedAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type CollectionFiltersState<TValue> = Omit<
  FiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: CollectionFiltersValues;
  pendingFilterValues: CollectionFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type CollectionFiltersValues = {
  name?: string;
};

type NameFilterChangedAction = {
  type: "collectionFilters/nameFilterChanged";
  value: string;
};

// Create reducer function
export function collectionFiltersReducer<
  TValue,
  TState extends CollectionFiltersState<TValue>,
>(state: TState, action: CollectionFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
    case "collectionFilters/nameFilterChanged": {
      return handleNameFilterChanged<TValue, TState>(state, action);
    }

    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

export function createInitialCollectionFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): CollectionFiltersState<TValue> {
  return createInitialFiltersState({
    values,
  });
}

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: "collectionFilters/nameFilterChanged", value };
}

/**
 * Handle Genre filter action
 */
function handleNameFilterChanged<
  TValue,
  TState extends CollectionFiltersState<TValue>,
>(state: TState, action: NameFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      name: action.value,
    },
  };
}
