import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection } from "src/api/collections";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { ListItem } from "../ListItem";
import { ListItemAvatar } from "../ListItemAvatar";
import { ListItemCounts } from "../ListItemCounts";
import type { Sort } from "./Collections.reducer";
import { Actions, initState, reducer } from "./Collections.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  Collection,
  "name" | "slug" | "titleCount" | "reviewCount"
> & {
  avatarImageProps: AvatarImageProps | null;
};

export interface Props {
  values: readonly ListItemValue[];
  initialSort: Sort;
  backdropImageProps: BackdropImageProps;
}

export function Collections({
  values,
  initialSort,
  backdropImageProps,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      title="Collections"
      alt='Claude Rains giving orders in "Casablanca (1942)"'
      deck={`"Okay ramblers, let's get rambling."`}
      backdropImageProps={backdropImageProps}
      totalCount={state.filteredValues.length}
      onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
      filtersVisible={state.showFilters}
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <ol data-testid="list" className="mt-4 bg-subtle showFilters:my-24">
          {values.map((value) => {
            return <CollectionListItem key={value.name} value={value} />;
          })}
        </ol>
      }
    />
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem className="items-center">
      <ListItemAvatar
        name={value.name}
        href={`/collections/${value.slug}/`}
        imageProps={value.avatarImageProps}
      />
      <CollectionName value={value} />
      <ListItemCounts current={value.reviewCount} total={value.titleCount} />
    </ListItem>
  );
}

function CollectionName({ value }: { value: ListItemValue }) {
  return (
    <a
      href={`/collections/${value.slug}/`}
      className="font-sans-narrow-bold text-sm text-accent tablet:text-base"
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
