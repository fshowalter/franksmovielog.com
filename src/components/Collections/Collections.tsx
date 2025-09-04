import { useReducer, useState } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { Collection } from "~/api/collections";

import { AvatarList, AvatarListItem } from "~/components/AvatarList";
import { ListItemName } from "~/components/ListItemName";
import { CollectionSortOptions } from "~/components/ListWithFilters/CollectionSortOptions";
import { ListWithFilters } from "~/components/ListWithFilters/ListWithFilters";

import type { Sort } from "./Collections.reducer";

import { Actions, initState, reducer } from "./Collections.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  Collection,
  "name" | "reviewCount" | "slug" | "titleCount"
> & {
  avatarImageProps: AvatarImageProps | undefined;
};

export type Props = {
  initialSort: Sort;
  values: ListItemValue[];
};

export function Collections({ initialSort, values }: Props): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <AvatarList
          className={`
            mt-4 bg-subtle
            tablet-landscape:my-24
          `}
        >
          {state.filteredValues.map((value) => {
            return <CollectionListItem key={value.name} value={value} />;
          })}
        </AvatarList>
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((prev) => prev + 1);
      }}
      onFilterDrawerOpen={() => {
        // Increment key to force remount of filter components
        setFilterKey((prev) => prev + 1);
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
      }}
      onResetFilters={() => dispatch({ type: Actions.RESET_PENDING_FILTERS })}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: (
          <CollectionSortOptions options={["name", "review-count"]} />
        ),
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function CollectionListItem({
  value,
}: {
  value: ListItemValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName href={`/collections/${value.slug}/`} name={value.name} />
        <div
          className={`
            font-sans text-[13px] font-normal tracking-prose text-nowrap
            text-subtle
          `}
        >
          {value.reviewCount} Reviews
        </div>
      </div>
    </AvatarListItem>
  );
}
