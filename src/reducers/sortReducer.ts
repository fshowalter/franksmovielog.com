export type SortAction<TSort> = {
  type: "sort/sort";
  value: TSort;
};

export type SortState<TSort> = {
  sort: TSort;
};

export function createInitialSortState<TSort>({
  initialSort,
}: {
  initialSort: TSort;
}): SortState<TSort> {
  return {
    sort: initialSort,
  };
}

export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: "sort/sort",
      value,
    };
  };
}

export function sortReducer<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return updateSort<TSort, TState>(state, action);
}

function updateSort<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return {
    ...state,
    sort: action.value,
  };
}
