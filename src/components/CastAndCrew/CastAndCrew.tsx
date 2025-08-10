import type { JSX } from "react";

import { useReducer } from "react";

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
import { Filters, SortOptions } from "./Filters";

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
      className="[--scroll-offset:52px]"
      filters={<Filters dispatch={dispatch} />}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          groupItemClassName={`scroll-mt-[52px]`}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <MemberListItem key={value.name} value={value} />;
          }}
        </GroupedList>
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
      subNav={
        <AlphabetSubNav
          groupedValues={state.groupedValues}
          sortValue={state.sortValue}
        />
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function AlphabetSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, ListItemValue[]>;
  sortValue: Sort;
}) {
  if (!sortValue.startsWith("name-")) {
    return;
  }

  const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  if (sortValue == "name-desc") {
    letters.reverse();
  }

  return (
    <nav className={`sticky top-0 z-nav-menu bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container font-sans text-sm font-normal
          tracking-wide
          laptop:justify-center
        `}
      >
        {letters.map((letter) => {
          return (
            <LetterLink
              key={letter}
              letter={letter}
              linkFunc={
                groupedValues.has(letter)
                  ? (letter: string) => `#${letter}`
                  : undefined
              }
            />
          );
        })}
      </ul>
    </nav>
  );
}

function LetterLink({
  letter,
  linkFunc,
}: {
  letter: string;
  linkFunc?: (letter: string) => string;
}) {
  return (
    <li
      className={`
        snap-start text-center
        ${linkFunc ? "text-inverse" : `text-inverse-subtle`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            block transform-gpu p-4 transition-all
            hover:scale-105 hover:bg-accent hover:text-inverse
          `}
          href={linkFunc(letter)}
        >
          {letter}
        </a>
      ) : (
        <div
          className={`
            p-4
            laptop:py-4
          `}
        >
          {letter}
        </div>
      )}
    </li>
  );
}

function MemberListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem extraVerticalPadding={true} itemsCenter={true}>
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
      <div
        className={`
          ml-auto font-sans text-xs text-nowrap text-subtle
          laptop:text-sm
        `}
      >
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
