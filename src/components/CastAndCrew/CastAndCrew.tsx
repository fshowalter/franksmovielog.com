import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { CastAndCrewMember } from "src/api/castAndCrew";

import { useReducer } from "react";
import { Backdrop } from "src/components/Backdrop";
import { CreditedAs } from "src/components/CreditedAs";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemAvatar } from "src/components/ListItemAvatar";
import { ListItemCounts } from "src/components/ListItemCounts";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import type { Sort } from "./CastAndCrew.reducer";

import { Actions, initState, reducer } from "./CastAndCrew.reducer";
import { Filters } from "./Filters";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  initialSort: Sort;
  values: ListItemValue[];
};

export type ListItemValue = {
  avatarImageProps: AvatarImageProps | null;
} & Pick<
  CastAndCrewMember,
  "creditedAs" | "name" | "reviewCount" | "slug" | "totalCount"
>;

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
      background="bg-default"
      extraVerticalPadding={true}
      itemsCenter={true}
    >
      <ListItemAvatar imageProps={value.avatarImageProps} name={value.name} />
      <MemberName value={value} />
      <ListItemCounts current={value.reviewCount} total={value.totalCount} />
    </ListItem>
  );
}

function MemberName({ value }: { value: ListItemValue }) {
  return (
    <div>
      <a
        className="font-sans text-sm font-medium leading-normal text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 tablet:before:bg-[#fff] desktop:before:left-6"
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
      <CreditedAs values={value.creditedAs} />
    </div>
  );
}
