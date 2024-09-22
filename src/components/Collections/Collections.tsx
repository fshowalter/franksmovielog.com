import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection } from "src/api/collections";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Backdrop } from "../Backdrop";
import { ListItem } from "../ListItem";
import { ListItemAvatar } from "../ListItemAvatar";
import { ListItemCounts } from "../ListItemCounts";
import type { Sort } from "./Collections.reducer";
import { initState, reducer } from "./Collections.reducer";
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
      backdrop={
        <Backdrop
          title="Collections"
          deck={`"Okay ramblers, let's get rambling."`}
          imageProps={backdropImageProps}
        />
      }
      totalCount={state.filteredValues.length}
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
      className="font-sans-narrow text-sm font-semibold text-accent decoration-accent decoration-2 underline-offset-4 hover:underline tablet:text-base"
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
