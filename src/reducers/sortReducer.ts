export enum SortActions {
  Sort = "sort/sort",
}

export type SortAction<TSort> = {
  type: SortActions.Sort;
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
      type: SortActions.Sort,
      value,
    };
  };
}

export function sortReducer<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  switch (action.type) {
    case SortActions.Sort: {
      return updateSort<TSort, TState>(state, action);
    }

    default: {
      return state;
    }
  }
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
