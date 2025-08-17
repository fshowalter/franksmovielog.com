import type { JSX } from "react";

import { useReducer, useState } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { CastAndCrewMember } from "~/api/castAndCrew";

import { AvatarListItem } from "~/components/AvatarList";
import { CreditedAs } from "~/components/CreditedAs";
import { GroupedList } from "~/components/GroupedList";
import { ListItemName } from "~/components/ListItemName";
import { ListWithFilters } from "~/components/ListWithFilters";

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
  initialSort: Sort;
  values: ListItemValue[];
};

export function CastAndCrew({ initialSort, values }: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
      className={
        state.sortValue.startsWith("name-") ? `[--scroll-offset:52px]` : ""
      }
      dynamicSubNav={
        <AlphabetSubNav
          groupedValues={state.groupedValues}
          sortValue={state.sortValue}
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          groupItemClassName={`scroll-mt-[calc(52px_+_var(--list-scroll-offset))]`}
          isGrid={false}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount ?? state.filteredValues.length}
        >
          {(value) => {
            return <MemberListItem key={value.name} value={value} />;
          }}
        </GroupedList>
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
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
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName
          href={`/cast-and-crew/${value.slug}/`}
          name={value.name}
        />
        <div className="mt-1">
          <CreditedAs className="font-light" values={value.creditedAs} />
        </div>
        <div
          className={`
            mt-[6px] font-sans text-xxs font-light text-nowrap text-muted
          `}
        >
          {value.reviewCount} Reviews
        </div>
      </div>
    </AvatarListItem>
  );
}
