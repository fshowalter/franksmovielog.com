/**
 * Action for updating sort state.
 */
export type SortAction<TSort> = {
  type: "sort/sort";
  value: TSort;
};

/**
 * State shape for sort functionality.
 */
type SortState<TSort> = {
  sort: TSort;
};

/**
 * Creates the initial state for sort functionality.
 * @param options - Configuration object
 * @param options.initialSort - The initial sort value
 * @returns Initial sort state object
 */
export function createInitialSortState<TSort>({
  initialSort,
}: {
  initialSort: TSort;
}): SortState<TSort> {
  return {
    sort: initialSort,
  };
}

/**
 * Creates an action creator function for sort actions.
 * @returns Function that creates sort actions with the provided value
 */
export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: "sort/sort",
      value,
    };
  };
}

/**
 * Reducer function for handling sort state updates.
 * Returns state unchanged for non-sort actions (facet contract).
 * @param state - Current sort state
 * @param action - Action to process
 * @returns Updated state with new sort value, or unchanged state
 */
export function sortReducer<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: { type: string },
): TState {
  if (action.type !== "sort/sort") return state;
  return {
    ...state,
    sort: (action as SortAction<TSort>).value,
  };
}
