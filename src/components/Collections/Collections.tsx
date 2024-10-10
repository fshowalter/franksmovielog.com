import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection } from "src/api/collections";

import { useReducer } from "react";
import { Backdrop } from "src/components/Backdrop";
import { ListItem } from "src/components/ListItem";
import { ListItemAvatar } from "src/components/ListItemAvatar";
import { ListItemCounts } from "src/components/ListItemCounts";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import type { Sort } from "./Collections.reducer";

import { initState, reducer } from "./Collections.reducer";
import { Filters } from "./Filters";

export type ListItemValue = {
  avatarImageProps: AvatarImageProps | null;
} & Pick<Collection, "name" | "reviewCount" | "slug" | "titleCount">;

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
    <ListItem extraVerticalPadding={true} itemsCenter={true}>
      <ListItemAvatar imageProps={value.avatarImageProps} name={value.name} />
      <CollectionName value={value} />
      <ListItemCounts current={value.reviewCount} total={value.titleCount} />
    </ListItem>
  );
}

function CollectionName({ value }: { value: ListItemValue }) {
  return (
    <a
      className="font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 hover:underline tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
      href={`/collections/${value.slug}/`}
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
