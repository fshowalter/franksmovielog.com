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
          bottomShadow={true}
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
      className={`
        group/list-item relative transform-gpu transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-105 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
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
      <MemberName value={value} />
      <div className="ml-auto font-sans text-xs text-nowrap text-subtle">
        {value.reviewCount}
      </div>
    </ListItem>
  );
}

function MemberName({ value }: { value: ListItemValue }) {
  return (
    <div>
      <a
        className={`
          leading-normal font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:size-full
          after:opacity-0
        `}
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
      <CreditedAs values={value.creditedAs} />
    </div>
  );
}
