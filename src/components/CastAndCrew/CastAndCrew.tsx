import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { CastAndCrewMember } from "src/api/castAndCrew";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Backdrop } from "../Backdrop";
import { CreditedAs } from "../CreditedAs";
import { ListItem } from "../ListItem";
import { ListItemAvatar } from "../ListItemAvatar";
import { ListItemCounts } from "../ListItemCounts";
import type { Sort } from "./CastAndCrew.reducer";
import { initState, reducer } from "./CastAndCrew.reducer";
import { Filters } from "./Filters";

export type Props = {
  values: ListItemValue[];
  initialSort: Sort;
  backdropImageProps: BackdropImageProps;
};

export type ListItemValue = Pick<
  CastAndCrewMember,
  "name" | "slug" | "totalCount" | "reviewCount" | "creditedAs"
> & {
  avatarImageProps: AvatarImageProps | null;
};

export function CastAndCrew({
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
          imageProps={backdropImageProps}
          title="Cast & Crew"
          deck='"Round up the usual suspects."'
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
            return <MemberListItem key={value.name} value={value} />;
          })}
        </ol>
      }
    />
  );
}

function MemberListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      background={value.slug ? "bg-default" : "bg-subtle"}
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
        className="font-sans text-base font-semibold leading-normal text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 hover:underline tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
      >
        {value.name}
      </a>
      <CreditedAs values={value.creditedAs} />
    </div>
  );
}
