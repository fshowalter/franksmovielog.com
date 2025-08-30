import type { JSX } from "react";

import type { CollectionFilterValues } from "~/components/ListWithFilters/collectionsReducerUtils";

import { CollectionFilters } from "~/components/CollectionFilters";

import type { ActionType } from "./Collections.reducer";

import { Actions } from "./Collections.reducer";

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: CollectionFilterValues;
}): JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          initialValue: filterValues.name,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_NAME, value }),
        }}
      />
    </>
  );
}
