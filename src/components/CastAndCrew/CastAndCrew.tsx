import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { CastAndCrewMember } from "src/api/castAndCrew";
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
  values: ListItemValue[];
  initialSort: Sort;
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export type ListItemValue = Pick<
  CastAndCrewMember,
  "name" | "slug" | "totalCount" | "reviewCount" | "creditedAs"
> & {
  avatarImageProps: AvatarImageProps | null;
};

export function CastAndCrew({
  values,
  deck,
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
          imageProps={backdropImageProps}
          title="Cast & Crew"
          deck={deck}
        />
      }
      totalCount={state.filteredValues.length}
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => {
            return <MemberListItem key={value.name} value={value} />;
          }}
        </GroupedList>
      }
    />
  );
}

function MemberListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      background="bg-default"
      itemsCenter={true}
      extraVerticalPadding={true}
    >
      <ListItemAvatar name={value.name} imageProps={value.avatarImageProps} />
      <MemberName value={value} />
      <ListItemCounts current={value.reviewCount} total={value.totalCount} />
    </ListItem>
  );
}

function MemberName({ value }: { value: ListItemValue }) {
  return (
    <div>
      <a
        href={`/cast-and-crew/${value.slug}/`}
        className="font-sans text-sm font-medium leading-normal text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 tablet:before:bg-[#fff] desktop:before:left-6"
      >
        {value.name}
      </a>
      <CreditedAs values={value.creditedAs} />
    </div>
  );
}
