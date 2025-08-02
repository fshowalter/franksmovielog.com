import { type JSX, useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { Collection } from "~/api/collections";

import { Backdrop } from "~/components/Backdrop";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

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
    <ListItem
      className={`
        group/list-item relative transform-gpu transition-transform
        tablet-landscape:has-[a:hover]:z-hover
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
      `}
      extraVerticalPadding={true}
      itemsCenter={true}
    >
      <div
        className={`
          relative rounded-full
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemAvatar imageProps={value.avatarImageProps} name={value.name} />
      </div>
      <CollectionName value={value} />
      <div
        className={`
          mr-2 ml-auto font-sans text-xs text-nowrap text-subtle
          tablet:text-sm
        `}
      >
        {value.reviewCount}
      </div>
    </ListItem>
  );
}

function CollectionName({ value }: { value: ListItemValue }) {
  return (
    <a
      className={`
        leading-normal font-sans text-sm font-medium text-accent
        after:absolute after:top-0 after:left-0 after:size-full after:opacity-0
      `}
      href={`/collections/${value.slug}/`}
    >
      <div className="leading-normal">{value.name}</div>
    </a>
  );
}
