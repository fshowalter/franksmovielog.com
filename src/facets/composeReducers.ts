// AIDEV-NOTE: composeReducers threads an action through a sequence of facet reducers
// left-to-right. Each facet handles its own action types and returns state unchanged
// for everything else. Composition order does not affect correctness.
export function composeReducers<TState>(
  ...reducers: ((state: TState, action: { type: string }) => TState)[]
): (state: TState, action: { type: string }) => TState {
  return (state, action) => {
    let result = state;
    for (const reducer of reducers) {
      result = reducer(result, action);
    }
    return result;
  };
}
