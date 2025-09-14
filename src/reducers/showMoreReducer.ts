/**
 * Default number of items to show per page for paginated Title lists
 */
const SHOW_COUNT_INCREMENT = 100;

export type ShowMoreAction = {
  type: "showMore/showMore";
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
  return { type: "showMore/showMore" };
}

export function showMoreReducer<TState extends ShowMoreState>(
  state: TState,
  action: ShowMoreAction,
): TState {
  switch (action.type) {
    case "showMore/showMore": {
      return handleShowMoreAction<TState>(state);
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
