/**
 * Default number of items to show per page for paginated Title lists
 */
const SHOW_COUNT_INCREMENT = 100;

/**
 * Title-specific action types
 */
export enum ShowMoreActions {
  Show_More = "showMore/showMore",
}

export type ShowMoreAction = {
  type: ShowMoreActions.Show_More;
};

export type ShowMoreState = {
  showCount: number;
};

export function createInitialShowMoreState(): ShowMoreState {
  return {
    showCount: SHOW_COUNT_INCREMENT,
  };
}

export function createShowMoreAction(): ShowMoreAction {
  return { type: ShowMoreActions.Show_More };
}

export function showMoreReducer<TState extends ShowMoreState>(
  state: TState,
  action: ShowMoreAction,
): TState {
  switch (action.type) {
    case ShowMoreActions.Show_More: {
      return handleShowMoreAction<TState>(state);
    }

    default: {
      return state;
    }
  }
}

/**
 * Handle "Show More" pagination for title lists
 */
function handleShowMoreAction<TState extends ShowMoreState>(
  state: TState,
  increment: number = SHOW_COUNT_INCREMENT,
): TState {
  const showCount = state.showCount + increment;

  return {
    ...state,
    showCount,
  };
}
