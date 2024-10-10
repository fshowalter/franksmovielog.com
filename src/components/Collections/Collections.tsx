import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection } from "src/api/collections";
import { Backdrop } from "src/components/Backdrop";
import { ListItem } from "src/components/ListItem";
import { ListItemAvatar } from "src/components/ListItemAvatar";
import { ListItemCounts } from "src/components/ListItemCounts";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

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
        <ol
          data-testid="list"
          className="mt-4 bg-subtle tablet-landscape:my-24"
        >
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
    <ListItem itemsCenter={true} extraVerticalPadding={true}>
      <ListItemAvatar name={value.name} imageProps={value.avatarImageProps} />
      <CollectionName value={value} />
      <ListItemCounts current={value.reviewCount} total={value.titleCount} />
    </ListItem>
  );
}

function CollectionName({ value }: { value: ListItemValue }) {
  return (
    <a
      href={`/collections/${value.slug}/`}
      className="font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 hover:underline tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
