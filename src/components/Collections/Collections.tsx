import type { JSX } from "react";

import { useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { Collection } from "~/api/collections";

import { AvatarListItem } from "~/components/AvatarList";
import { ListItemName } from "~/components/ListItemName";
import { ListWithFilters } from "~/components/ListWithFilters";

import type { Sort } from "./Collections.reducer";

import { Actions, initState, reducer } from "./Collections.reducer";
import { Filters, SortOptions } from "./Filters";

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

export function Collections({ initialSort, values }: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFilters
      filters={<Filters dispatch={dispatch} />}
      list={
        <ol
          className={`
            mt-4 bg-subtle
            tablet-landscape:my-24
          `}
          data-testid="list"
        >
          {values.map((value) => {
            return <CollectionListItem key={value.name} value={value} />;
          })}
        </ol>
      }
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName href={`/collections/${value.slug}/`} name={value.name} />
        <div
          className={`mt-1 font-sans text-xxs font-light text-nowrap text-muted`}
        >
          {value.reviewCount} Reviewed Titles
        </div>
      </div>
    </AvatarListItem>
  );
}
