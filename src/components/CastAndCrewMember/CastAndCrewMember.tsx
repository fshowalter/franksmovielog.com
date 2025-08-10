import type { JSX } from "react";

import { useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { CastAndCrewMember } from "~/api/castAndCrew";
import type { PosterImageProps } from "~/api/posters";

import { CreditedAs } from "~/components/CreditedAs";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters";
import { WatchlistTitleSlug } from "~/components/WatchlistTitleSlug";

import type { Sort } from "./CastAndCrewMember.reducer";

import { Actions, initState, reducer } from "./CastAndCrewMember.reducer";
import { Filters, SortOptions } from "./Filters";

export type ListItemValue = Pick<
  CastAndCrewMember["titles"][0],
  | "creditedAs"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "releaseYear"
  | "slug"
  | "sortTitle"
  | "title"
  | "watchlistCollectionNames"
  | "watchlistDirectorNames"
  | "watchlistPerformerNames"
  | "watchlistWriterNames"
> & {
  posterImageProps: PosterImageProps;
  reviewDisplayDate: string;
  reviewSequence?: string;
  reviewYear: string;
};

export type Props = {
  avatarImageProps: AvatarImageProps | undefined;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CastAndCrewMember,
    "creditedAs" | "name" | "reviewCount" | "titleCount"
  >;
};

export function CastAndCrewMember({
  avatarImageProps: _avatarImageProps,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  titles,
  value,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...titles],
    },
    initState,
  );
  return (
    <ListWithFilters
      filters={
        <Filters
          creditedAs={value.creditedAs}
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          hideReviewed={state.hideReviewed}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <TitleListItem key={value.imdbId} value={value} />;
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
      totalCount={state.filteredValues.length}
    />
  );
}

function TitleListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem background={value.slug ? "bg-default" : "bg-unreviewed"}>
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full
          laptop:pr-4
        `}
      >
        <CreditedAs values={value.creditedAs} />
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        {value.grade && (
          <Grade className="mb-1" height={16} value={value.grade} />
        )}
        {!value.grade && (
          <WatchlistTitleSlug
            collectionNames={value.watchlistCollectionNames}
            directorNames={value.watchlistDirectorNames}
            performerNames={value.watchlistPerformerNames}
            writerNames={value.watchlistWriterNames}
          />
        )}
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.reviewDisplayDate}
        </div>
      </div>
    </ListItem>
  );
}
