import { type JSX, useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { CastAndCrewMember } from "~/api/castAndCrew";

import { Backdrop } from "~/components/Backdrop";
import { CreditedAs } from "~/components/CreditedAs";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

import type { Sort } from "./CastAndCrew.reducer";

import { Actions, initState, reducer } from "./CastAndCrew.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  CastAndCrewMember,
  "creditedAs" | "name" | "reviewCount" | "slug"
> & {
  avatarImageProps: AvatarImageProps | undefined;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  initialSort: Sort;
  values: ListItemValue[];
};

export function CastAndCrew({
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
          title="Cast & Crew"
        />
      }
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <MemberListItem key={value.name} value={value} />;
          }}
        </GroupedList>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function MemberListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      className="has-[a:hover]:bg-hover has-[a:hover]:shadow-hover"
      extraVerticalPadding={true}
      itemsCenter={true}
    >
      <ListItemAvatar imageProps={value.avatarImageProps} name={value.name} />
      <MemberName value={value} />
      <div className="ml-auto text-nowrap font-sans text-xs text-subtle">
        {value.reviewCount}
      </div>
    </ListItem>
  );
}

function MemberName({ value }: { value: ListItemValue }) {
  return (
    <div>
      <a
        className="font-sans text-sm font-medium leading-normal text-accent before:absolute before:left-(--container-padding) before:top-4 before:aspect-square before:w-16 before:opacity-15 after:absolute after:left-0 after:top-0 after:size-full after:opacity-0 hover:before:opacity-0 tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 tablet:before:bg-default desktop:before:left-6"
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
      <CreditedAs values={value.creditedAs} />
    </div>
  );
}
