import { type JSX, useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { Collection } from "~/api/collections";

import { Backdrop } from "~/components/Backdrop";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

import type { Sort } from "./Collections.reducer";

import { initState, reducer } from "./Collections.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  Collection,
  "name" | "reviewCount" | "slug" | "titleCount"
> & {
  avatarImageProps: AvatarImageProps | undefined;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  initialSort: Sort;
  values: readonly ListItemValue[];
};

export function Collections({
  backdropImageProps,
  deck,
  initialSort,
  values,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          deck={deck}
          imageProps={backdropImageProps}
          title="Collections"
        />
      }
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <ol
          className="mt-4 bg-subtle tablet-landscape:my-24"
          data-testid="list"
        >
          {values.map((value) => {
            return <CollectionListItem key={value.name} value={value} />;
          })}
        </ol>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      className="has-[a:hover]:bg-hover has-[a:hover]:shadow-hover"
      extraVerticalPadding={true}
      itemsCenter={true}
    >
      <ListItemAvatar imageProps={value.avatarImageProps} name={value.name} />
      <CollectionName value={value} />
      <div className="ml-auto text-nowrap font-sans text-xs text-subtle">
        {value.reviewCount}
      </div>
    </ListItem>
  );
}

function CollectionName({ value }: { value: ListItemValue }) {
  return (
    <a
      className="font-sans text-sm font-medium text-accent before:absolute before:left-(--container-padding) before:top-4 before:aspect-square before:w-16 before:bg-default before:opacity-15 after:absolute after:left-0 after:top-0 after:size-full after:opacity-0 hover:before:opacity-0 tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
      href={`/collections/${value.slug}/`}
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
